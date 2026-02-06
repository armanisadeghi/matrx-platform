-- ============================================================================
-- Migration: 001_core_schema
-- Description: Core tables for the Matrx platform template
-- Tables: profiles, organizations, organization_members, user_preferences
-- ============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================================
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text not null,
  email text not null,
  bio text,
  avatar_url text,
  role text not null default 'member' check (role in ('super_admin', 'admin', 'member', 'viewer')),
  is_active boolean not null default true,
  last_sign_in_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'User profiles extending Supabase auth.users';

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (user_id, display_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

-- RLS
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Indexes
create index idx_profiles_user_id on public.profiles(user_id);
create index idx_profiles_email on public.profiles(email);
create index idx_profiles_role on public.profiles(role);

-- ============================================================================
-- ORGANIZATIONS
-- ============================================================================
create table public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  owner_id uuid not null references auth.users(id) on delete restrict,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro', 'enterprise')),
  settings jsonb default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.organizations is 'Organizations / tenants';

create trigger organizations_updated_at
  before update on public.organizations
  for each row execute function public.update_updated_at();

-- RLS
alter table public.organizations enable row level security;

create policy "Members can view their organizations"
  on public.organizations for select
  to authenticated
  using (
    id in (
      select organization_id from public.organization_members
      where user_id = auth.uid()
    )
  );

create policy "Owners can update their organizations"
  on public.organizations for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "Authenticated users can create organizations"
  on public.organizations for insert
  to authenticated
  with check (owner_id = auth.uid());

-- Indexes
create index idx_organizations_slug on public.organizations(slug);
create index idx_organizations_owner on public.organizations(owner_id);

-- ============================================================================
-- ORGANIZATION MEMBERS (many-to-many with roles)
-- ============================================================================
create table public.organization_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  invited_by uuid references auth.users(id),
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(organization_id, user_id)
);

comment on table public.organization_members is 'Organization membership with role-based access';

create trigger organization_members_updated_at
  before update on public.organization_members
  for each row execute function public.update_updated_at();

-- Auto-add owner as member when org is created
create or replace function public.handle_new_organization()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.organization_members (organization_id, user_id, role)
  values (new.id, new.owner_id, 'owner');
  return new;
end;
$$;

create trigger on_organization_created
  after insert on public.organizations
  for each row execute function public.handle_new_organization();

-- RLS
alter table public.organization_members enable row level security;

create policy "Members can view their org members"
  on public.organization_members for select
  to authenticated
  using (
    organization_id in (
      select organization_id from public.organization_members
      where user_id = auth.uid()
    )
  );

create policy "Admins can manage members"
  on public.organization_members for insert
  to authenticated
  with check (
    organization_id in (
      select organization_id from public.organization_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create policy "Admins can update members"
  on public.organization_members for update
  to authenticated
  using (
    organization_id in (
      select organization_id from public.organization_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create policy "Admins can remove members"
  on public.organization_members for delete
  to authenticated
  using (
    organization_id in (
      select organization_id from public.organization_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- Indexes
create index idx_org_members_org on public.organization_members(organization_id);
create index idx_org_members_user on public.organization_members(user_id);

-- ============================================================================
-- USER PREFERENCES
-- ============================================================================
create table public.user_preferences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  language text not null default 'en',
  timezone text not null default 'UTC',
  notifications jsonb not null default '{"email": true, "push": true, "in_app": true}'::jsonb,
  dashboard_layout jsonb default '{}'::jsonb,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.user_preferences is 'Per-user application preferences';

create trigger user_preferences_updated_at
  before update on public.user_preferences
  for each row execute function public.update_updated_at();

-- Auto-create preferences on profile creation
create or replace function public.handle_new_profile()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.user_preferences (user_id)
  values (new.user_id);
  return new;
end;
$$;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute function public.handle_new_profile();

-- RLS
alter table public.user_preferences enable row level security;

create policy "Users can view own preferences"
  on public.user_preferences for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can update own preferences"
  on public.user_preferences for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Index
create index idx_user_preferences_user on public.user_preferences(user_id);
