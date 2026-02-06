-- ============================================================================
-- Migration: 003_platform_schema
-- Description: Version tracking, AI integrations, Supabase storage buckets
-- ============================================================================

-- ============================================================================
-- APP VERSIONS (build & deployment tracking)
-- ============================================================================
create table public.app_versions (
  id uuid primary key default uuid_generate_v4(),
  app_name text not null check (app_name in ('web', 'mobile_ios', 'mobile_android')),
  version text not null,
  build_number int,
  -- Git info
  git_commit_sha text,
  git_branch text,
  git_tag text,
  -- Deployment info
  environment text not null default 'production' check (environment in ('development', 'staging', 'production')),
  deployment_provider text check (deployment_provider in ('vercel', 'eas', 'manual')),
  deployment_url text,
  deployment_id text,
  -- Status
  status text not null default 'deployed' check (status in ('building', 'deployed', 'failed', 'rolled_back')),
  -- Release notes
  changelog text,
  is_current boolean not null default false,
  -- Metadata from CI/CD
  build_metadata jsonb default '{}'::jsonb,
  deployed_by uuid references auth.users(id),
  deployed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

comment on table public.app_versions is 'Tracks build versions and deployments across web and mobile apps';

-- Ensure only one "current" version per app+environment
create unique index idx_app_versions_current
  on public.app_versions(app_name, environment)
  where is_current = true;

-- When setting a new version as current, unset the previous one
create or replace function public.handle_version_current()
returns trigger
language plpgsql
as $$
begin
  if new.is_current = true then
    update public.app_versions
    set is_current = false
    where app_name = new.app_name
      and environment = new.environment
      and id != new.id
      and is_current = true;
  end if;
  return new;
end;
$$;

create trigger app_versions_current
  before insert or update of is_current on public.app_versions
  for each row
  when (new.is_current = true)
  execute function public.handle_version_current();

-- RLS
alter table public.app_versions enable row level security;

create policy "Authenticated users can view versions"
  on public.app_versions for select
  to authenticated
  using (true);

create policy "Admins can manage versions"
  on public.app_versions for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where user_id = auth.uid() and role in ('super_admin', 'admin')
    )
  );

-- Indexes
create index idx_app_versions_app on public.app_versions(app_name, environment);
create index idx_app_versions_deployed on public.app_versions(deployed_at desc);

-- ============================================================================
-- AI INTEGRATIONS (workspaces for AI features)
-- ============================================================================
create table public.workspaces (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  settings jsonb default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.workspaces is 'Workspaces for organizing AI integrations';

create trigger workspaces_updated_at
  before update on public.workspaces
  for each row execute function public.update_updated_at();

alter table public.workspaces enable row level security;

create policy "Org members can view workspaces"
  on public.workspaces for select
  to authenticated
  using (
    organization_id in (
      select organization_id from public.organization_members
      where user_id = auth.uid()
    )
  );

create policy "Org admins can manage workspaces"
  on public.workspaces for all
  to authenticated
  using (
    organization_id in (
      select organization_id from public.organization_members
      where user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

create index idx_workspaces_org on public.workspaces(organization_id);

-- ============================================================================
-- AI INTEGRATIONS
-- ============================================================================
create table public.ai_integrations (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  description text,
  type text not null check (type in ('prompt', 'agent', 'workflow')),
  config jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  version int not null default 1,
  last_executed_at timestamptz,
  execution_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.ai_integrations is 'AI integration configurations (prompts, agents, workflows)';

create trigger ai_integrations_updated_at
  before update on public.ai_integrations
  for each row execute function public.update_updated_at();

alter table public.ai_integrations enable row level security;

create policy "Workspace members can view integrations"
  on public.ai_integrations for select
  to authenticated
  using (
    workspace_id in (
      select w.id from public.workspaces w
      join public.organization_members om on w.organization_id = om.organization_id
      where om.user_id = auth.uid()
    )
  );

create policy "Workspace admins can manage integrations"
  on public.ai_integrations for all
  to authenticated
  using (
    workspace_id in (
      select w.id from public.workspaces w
      join public.organization_members om on w.organization_id = om.organization_id
      where om.user_id = auth.uid() and om.role in ('owner', 'admin')
    )
  );

create index idx_ai_integrations_workspace on public.ai_integrations(workspace_id);
create index idx_ai_integrations_type on public.ai_integrations(type);

-- ============================================================================
-- STORAGE BUCKETS (created via Supabase dashboard or CLI)
-- ============================================================================
-- Note: These would normally be created via the Supabase CLI or dashboard.
-- This serves as documentation of the expected bucket structure.
--
-- Buckets to create:
--   avatars       - User profile pictures (public, 5MB limit)
--   attachments   - User-uploaded files (private, 10MB limit)
--   blog-images   - Blog post cover images and media (public, 10MB limit)
--   page-assets   - Dynamic page assets (public, 10MB limit)
--   exports       - Generated exports/reports (private, 50MB limit)

-- Storage policies are managed via Supabase Storage policies, not RLS.
-- Example policies for reference:
--
-- avatars bucket:
--   SELECT: public (no auth required)
--   INSERT: authenticated, path starts with user's UUID
--   UPDATE: authenticated, path starts with user's UUID
--   DELETE: authenticated, path starts with user's UUID
--
-- attachments bucket:
--   SELECT: authenticated, path starts with user's UUID
--   INSERT: authenticated, path starts with user's UUID
--   DELETE: authenticated, path starts with user's UUID
