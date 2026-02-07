-- ============================================================
-- Migration 004: Error Tracking System
-- ============================================================
-- Two-table architecture (Sentry-like):
--   error_groups  = deduplicated issues (what admins manage)
--   error_events  = individual occurrences (full context)
--   error_rate_limits = server-side flood prevention
-- ============================================================

-- Error groups (deduplicated issues)
CREATE TABLE IF NOT EXISTS error_groups (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  fingerprint    text NOT NULL UNIQUE,
  title          text NOT NULL,
  culprit        text,
  platform       text NOT NULL DEFAULT 'unknown',
  level          text NOT NULL DEFAULT 'error'
                   CHECK (level IN ('fatal', 'error', 'warning', 'info')),
  status         text NOT NULL DEFAULT 'unresolved'
                   CHECK (status IN ('unresolved', 'resolved', 'ignored', 'muted')),
  first_seen_at  timestamptz NOT NULL DEFAULT now(),
  last_seen_at   timestamptz NOT NULL DEFAULT now(),
  event_count    bigint NOT NULL DEFAULT 1,
  user_count     bigint NOT NULL DEFAULT 0,
  assigned_to    uuid,
  resolved_at    timestamptz,
  resolved_by    uuid,
  tags           jsonb NOT NULL DEFAULT '{}',
  metadata       jsonb NOT NULL DEFAULT '{}',
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_error_groups_fingerprint ON error_groups (fingerprint);
CREATE INDEX idx_error_groups_status ON error_groups (status);
CREATE INDEX idx_error_groups_platform ON error_groups (platform);
CREATE INDEX idx_error_groups_level ON error_groups (level);
CREATE INDEX idx_error_groups_last_seen ON error_groups (last_seen_at DESC);

-- Individual error events
CREATE TABLE IF NOT EXISTS error_events (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id       uuid NOT NULL REFERENCES error_groups(id) ON DELETE CASCADE,
  message        text NOT NULL,
  stack_trace    text,
  platform       text NOT NULL DEFAULT 'unknown',
  environment    text NOT NULL DEFAULT 'production',
  release        text,
  user_id        uuid,
  user_agent     text,
  ip_address     text,
  url            text,
  component      text,
  action         text,
  breadcrumbs    jsonb DEFAULT '[]',
  context        jsonb DEFAULT '{}',
  tags           jsonb DEFAULT '{}',
  request        jsonb,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_error_events_group_id ON error_events (group_id);
CREATE INDEX idx_error_events_created_at ON error_events (created_at DESC);
CREATE INDEX idx_error_events_user_id ON error_events (user_id);
CREATE INDEX idx_error_events_environment ON error_events (environment);

-- Rate limiting table (prevents ingestion flooding)
CREATE TABLE IF NOT EXISTS error_rate_limits (
  fingerprint    text NOT NULL,
  window_start   timestamptz NOT NULL,
  event_count    integer NOT NULL DEFAULT 1,
  PRIMARY KEY (fingerprint, window_start)
);

CREATE INDEX idx_error_rate_limits_window ON error_rate_limits (window_start);

-- Auto-update updated_at on error_groups
CREATE OR REPLACE FUNCTION update_error_groups_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_error_groups_updated_at
  BEFORE UPDATE ON error_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_error_groups_updated_at();

-- Increment event_count atomically (called from API)
CREATE OR REPLACE FUNCTION increment_error_group_count(
  p_fingerprint text,
  p_title text,
  p_culprit text DEFAULT NULL,
  p_platform text DEFAULT 'unknown',
  p_level text DEFAULT 'error'
)
RETURNS uuid AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO error_groups (fingerprint, title, culprit, platform, level)
  VALUES (p_fingerprint, p_title, p_culprit, p_platform, p_level)
  ON CONFLICT (fingerprint) DO UPDATE SET
    event_count = error_groups.event_count + 1,
    last_seen_at = now(),
    -- Reopen if it was resolved and the error recurred
    status = CASE
      WHEN error_groups.status = 'resolved' THEN 'unresolved'
      ELSE error_groups.status
    END,
    -- Update level if new event is more severe
    level = CASE
      WHEN (
        CASE p_level
          WHEN 'fatal' THEN 4
          WHEN 'error' THEN 3
          WHEN 'warning' THEN 2
          ELSE 1
        END
      ) > (
        CASE error_groups.level
          WHEN 'fatal' THEN 4
          WHEN 'error' THEN 3
          WHEN 'warning' THEN 2
          ELSE 1
        END
      ) THEN p_level
      ELSE error_groups.level
    END
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- Rate limit check function (returns true if allowed)
CREATE OR REPLACE FUNCTION check_error_rate_limit(
  p_fingerprint text,
  p_window_minutes integer DEFAULT 5,
  p_max_per_window integer DEFAULT 50
)
RETURNS boolean AS $$
DECLARE
  v_window_start timestamptz;
  v_count integer;
BEGIN
  -- Calculate the start of the current window
  v_window_start := date_trunc('minute', now())
    - (EXTRACT(MINUTE FROM now())::integer % p_window_minutes) * interval '1 minute';

  -- Upsert the rate limit counter
  INSERT INTO error_rate_limits (fingerprint, window_start, event_count)
  VALUES (p_fingerprint, v_window_start, 1)
  ON CONFLICT (fingerprint, window_start) DO UPDATE SET
    event_count = error_rate_limits.event_count + 1
  RETURNING event_count INTO v_count;

  RETURN v_count <= p_max_per_window;
END;
$$ LANGUAGE plpgsql;

-- Cleanup function for old rate limit entries (call periodically)
CREATE OR REPLACE FUNCTION cleanup_error_rate_limits(p_older_than_hours integer DEFAULT 1)
RETURNS integer AS $$
DECLARE
  v_deleted integer;
BEGIN
  DELETE FROM error_rate_limits
  WHERE window_start < now() - (p_older_than_hours || ' hours')::interval;

  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE error_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_rate_limits ENABLE ROW LEVEL SECURITY;

-- Service role has full access (used by the API endpoint)
CREATE POLICY error_groups_service_all ON error_groups
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY error_events_service_all ON error_events
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY error_rate_limits_service_all ON error_rate_limits
  FOR ALL USING (true) WITH CHECK (true);
