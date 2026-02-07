-- ============================================================================
-- Migration: 006_deployment_system
-- Description: Extend app_versions for full deployment lifecycle tracking.
--              Adds 'pending' and 'canceled' to the status constraint,
--              indexes for efficient webhook/commit lookups, and a
--              service-role write policy for CI/CD scripts.
-- ============================================================================

-- 1. Extend the status CHECK constraint to include 'pending' and 'canceled'
alter table public.app_versions
  drop constraint if exists app_versions_status_check;

alter table public.app_versions
  add constraint app_versions_status_check
  check (status in ('pending', 'building', 'deployed', 'failed', 'rolled_back', 'canceled'));

-- 2. Change the default status to 'pending' (deploy scripts create records before build starts)
alter table public.app_versions
  alter column status set default 'pending';

-- 3. Add indexes for webhook and sync lookups
create index if not exists idx_app_versions_git_commit_sha
  on public.app_versions(git_commit_sha);

create index if not exists idx_app_versions_deployment_id
  on public.app_versions(deployment_id);

create index if not exists idx_app_versions_status
  on public.app_versions(status);

-- 4. Allow service_role to write version records (bypasses RLS by default,
--    but this explicit policy documents the intent and covers edge cases)
create policy "Service role can manage versions"
  on public.app_versions for all
  to service_role
  using (true)
  with check (true);

-- 5. Allow anonymous/public read access for the client version-check endpoint
create policy "Public can read versions"
  on public.app_versions for select
  to anon
  using (true);
