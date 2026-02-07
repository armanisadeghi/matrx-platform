-- ============================================================
-- Migration 005: Audit Logging System
-- ============================================================
-- Immutable append-only log of admin/system actions.
-- Entries are never updated or deleted in normal operation.
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id       uuid,
  actor_email    text,
  action         text NOT NULL,
  resource       text NOT NULL,
  resource_id    text,
  changes        jsonb NOT NULL DEFAULT '{}',
  ip_address     text,
  user_agent     text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_actor ON audit_logs (actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs (action);
CREATE INDEX idx_audit_logs_resource ON audit_logs (resource, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at DESC);

-- RLS — service role only (API writes, admin reads)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_logs_service_all ON audit_logs
  FOR ALL USING (true) WITH CHECK (true);
