-- ============================================================================
-- Migration: 002_content_schema
-- Description: Blog system, dynamic pages, file metadata
-- ============================================================================

-- ============================================================================
-- BLOG CATEGORIES
-- ============================================================================
create table public.blog_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  parent_id uuid references public.blog_categories(id) on delete set null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.blog_categories is 'Blog post categories with optional nesting';

create trigger blog_categories_updated_at
  before update on public.blog_categories
  for each row execute function public.update_updated_at();

-- RLS (public read, admin write)
alter table public.blog_categories enable row level security;

create policy "Anyone can view categories"
  on public.blog_categories for select
  using (true);

create policy "Admins can manage categories"
  on public.blog_categories for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where user_id = auth.uid() and role in ('super_admin', 'admin')
    )
  );

-- ============================================================================
-- BLOG POSTS
-- ============================================================================
create table public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  content_format text not null default 'markdown' check (content_format in ('markdown', 'html', 'rich_text')),
  cover_image_url text,
  author_id uuid not null references auth.users(id) on delete restrict,
  category_id uuid references public.blog_categories(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  tags text[] default '{}',
  seo_title text,
  seo_description text,
  seo_keywords text[],
  og_image_url text,
  view_count int not null default 0,
  reading_time_minutes int,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.blog_posts is 'Blog posts with SEO, categories, and publishing workflow';

create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.update_updated_at();

-- Auto-calculate reading time
create or replace function public.calculate_reading_time()
returns trigger
language plpgsql
as $$
begin
  -- ~200 words per minute, average 5 chars per word
  new.reading_time_minutes = greatest(1, ceil(length(new.content) / 5.0 / 200.0));
  return new;
end;
$$;

create trigger blog_posts_reading_time
  before insert or update of content on public.blog_posts
  for each row execute function public.calculate_reading_time();

-- Auto-set published_at
create or replace function public.handle_blog_publish()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'published' and old.status != 'published' then
    new.published_at = coalesce(new.published_at, now());
  end if;
  return new;
end;
$$;

create trigger blog_posts_publish
  before update of status on public.blog_posts
  for each row execute function public.handle_blog_publish();

-- RLS
alter table public.blog_posts enable row level security;

create policy "Published posts are viewable by everyone"
  on public.blog_posts for select
  using (status = 'published' or author_id = auth.uid());

create policy "Authors can create posts"
  on public.blog_posts for insert
  to authenticated
  with check (
    author_id = auth.uid() and
    exists (
      select 1 from public.profiles
      where user_id = auth.uid() and role in ('super_admin', 'admin')
    )
  );

create policy "Authors can update own posts"
  on public.blog_posts for update
  to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

create policy "Admins can delete posts"
  on public.blog_posts for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where user_id = auth.uid() and role in ('super_admin', 'admin')
    )
  );

-- Indexes
create index idx_blog_posts_slug on public.blog_posts(slug);
create index idx_blog_posts_author on public.blog_posts(author_id);
create index idx_blog_posts_status on public.blog_posts(status);
create index idx_blog_posts_published on public.blog_posts(published_at desc) where status = 'published';
create index idx_blog_posts_category on public.blog_posts(category_id);
create index idx_blog_posts_tags on public.blog_posts using gin(tags);

-- ============================================================================
-- DYNAMIC PAGES (DB-stored content rendered at runtime)
-- ============================================================================
create table public.dynamic_pages (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  content text not null default '',
  content_type text not null default 'html' check (content_type in ('html', 'react', 'markdown')),
  -- Security: pages are sanitized before rendering
  is_sandboxed boolean not null default true,
  -- Allow custom CSS and head tags
  custom_css text,
  head_tags text,
  -- Page metadata
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  author_id uuid not null references auth.users(id) on delete restrict,
  published_at timestamptz,
  -- Layout options
  layout text not null default 'default' check (layout in ('default', 'full_width', 'sidebar', 'blank')),
  -- SEO
  seo_title text,
  seo_description text,
  og_image_url text,
  metadata jsonb default '{}'::jsonb,
  -- Versioning
  version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.dynamic_pages is 'DB-stored pages rendered at runtime (CMS-like). Content is sanitized before rendering.';

create trigger dynamic_pages_updated_at
  before update on public.dynamic_pages
  for each row execute function public.update_updated_at();

-- Auto-increment version on update
create or replace function public.increment_page_version()
returns trigger
language plpgsql
as $$
begin
  if new.content != old.content then
    new.version = old.version + 1;
  end if;
  return new;
end;
$$;

create trigger dynamic_pages_version
  before update of content on public.dynamic_pages
  for each row execute function public.increment_page_version();

-- RLS
alter table public.dynamic_pages enable row level security;

create policy "Published pages are viewable by everyone"
  on public.dynamic_pages for select
  using (
    status = 'published' or
    exists (
      select 1 from public.profiles
      where user_id = auth.uid() and role in ('super_admin', 'admin')
    )
  );

create policy "Admins can manage pages"
  on public.dynamic_pages for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where user_id = auth.uid() and role in ('super_admin', 'admin')
    )
  );

-- Indexes
create index idx_dynamic_pages_slug on public.dynamic_pages(slug);
create index idx_dynamic_pages_status on public.dynamic_pages(status);

-- ============================================================================
-- FILE METADATA (supplements Supabase Storage)
-- ============================================================================
create table public.file_metadata (
  id uuid primary key default uuid_generate_v4(),
  storage_path text not null,
  bucket text not null,
  filename text not null,
  mime_type text not null,
  size_bytes bigint not null,
  -- Ownership
  uploaded_by uuid not null references auth.users(id) on delete restrict,
  organization_id uuid references public.organizations(id) on delete set null,
  -- Categorization
  category text default 'general',
  tags text[] default '{}',
  description text,
  -- Image-specific
  width int,
  height int,
  blurhash text,
  -- Public URL (generated)
  public_url text,
  is_public boolean not null default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.file_metadata is 'Metadata for files stored in Supabase Storage buckets';

create trigger file_metadata_updated_at
  before update on public.file_metadata
  for each row execute function public.update_updated_at();

-- RLS
alter table public.file_metadata enable row level security;

create policy "Users can view own files and public files"
  on public.file_metadata for select
  to authenticated
  using (
    is_public = true or
    uploaded_by = auth.uid() or
    organization_id in (
      select organization_id from public.organization_members
      where user_id = auth.uid()
    )
  );

create policy "Users can upload files"
  on public.file_metadata for insert
  to authenticated
  with check (uploaded_by = auth.uid());

create policy "Users can update own file metadata"
  on public.file_metadata for update
  to authenticated
  using (uploaded_by = auth.uid())
  with check (uploaded_by = auth.uid());

create policy "Users can delete own files"
  on public.file_metadata for delete
  to authenticated
  using (uploaded_by = auth.uid());

-- Indexes
create index idx_file_metadata_uploaded_by on public.file_metadata(uploaded_by);
create index idx_file_metadata_org on public.file_metadata(organization_id);
create index idx_file_metadata_bucket on public.file_metadata(bucket);
create index idx_file_metadata_tags on public.file_metadata using gin(tags);
