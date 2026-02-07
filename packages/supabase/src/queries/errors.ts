import type { SupabaseClient } from "../client";

/**
 * Error Tracking Query Functions
 *
 * Type-safe queries for error_groups, error_events, and audit_logs.
 */

// ============================================================================
// Error Groups
// ============================================================================

export async function getErrorGroups(
  client: SupabaseClient,
  filters?: {
    status?: string;
    level?: string;
    platform?: string;
    search?: string;
    page?: number;
    perPage?: number;
  }
) {
  const page = filters?.page ?? 1;
  const perPage = filters?.perPage ?? 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = client
    .from("error_groups")
    .select("*", { count: "exact" })
    .order("last_seen_at", { ascending: false })
    .range(from, to);

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.level) {
    query = query.eq("level", filters.level);
  }
  if (filters?.platform) {
    query = query.eq("platform", filters.platform);
  }
  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  return query;
}

export async function getErrorGroupById(
  client: SupabaseClient,
  id: string
) {
  return client
    .from("error_groups")
    .select("*")
    .eq("id", id)
    .single();
}

export async function updateErrorGroupStatus(
  client: SupabaseClient,
  id: string,
  status: "unresolved" | "resolved" | "ignored" | "muted",
  resolvedBy?: string
) {
  const update: Record<string, unknown> = { status };

  if (status === "resolved") {
    update.resolved_at = new Date().toISOString();
    if (resolvedBy) update.resolved_by = resolvedBy;
  } else {
    update.resolved_at = null;
    update.resolved_by = null;
  }

  return client
    .from("error_groups")
    .update(update)
    .eq("id", id)
    .select()
    .single();
}

export async function assignErrorGroup(
  client: SupabaseClient,
  id: string,
  assignedTo: string | null
) {
  return client
    .from("error_groups")
    .update({ assigned_to: assignedTo })
    .eq("id", id)
    .select()
    .single();
}

export async function deleteErrorGroup(
  client: SupabaseClient,
  id: string
) {
  return client
    .from("error_groups")
    .delete()
    .eq("id", id);
}

export async function getErrorGroupStats(client: SupabaseClient) {
  const [unresolved, fatal, today] = await Promise.all([
    client
      .from("error_groups")
      .select("id", { count: "exact", head: true })
      .eq("status", "unresolved"),
    client
      .from("error_groups")
      .select("id", { count: "exact", head: true })
      .eq("level", "fatal")
      .eq("status", "unresolved"),
    client
      .from("error_groups")
      .select("id", { count: "exact", head: true })
      .gte("last_seen_at", new Date(Date.now() - 86400000).toISOString()),
  ]);

  return {
    unresolvedCount: unresolved.count ?? 0,
    fatalCount: fatal.count ?? 0,
    activeToday: today.count ?? 0,
  };
}

// ============================================================================
// Error Events
// ============================================================================

export async function getErrorEvents(
  client: SupabaseClient,
  groupId: string,
  options?: { page?: number; perPage?: number }
) {
  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  return client
    .from("error_events")
    .select("*", { count: "exact" })
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })
    .range(from, to);
}

export async function getErrorEventById(
  client: SupabaseClient,
  eventId: string
) {
  return client
    .from("error_events")
    .select("*")
    .eq("id", eventId)
    .single();
}

// ============================================================================
// Audit Logs
// ============================================================================

export async function getAuditLogs(
  client: SupabaseClient,
  filters?: {
    actorId?: string;
    resource?: string;
    action?: string;
    page?: number;
    perPage?: number;
  }
) {
  const page = filters?.page ?? 1;
  const perPage = filters?.perPage ?? 50;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = client
    .from("audit_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters?.actorId) {
    query = query.eq("actor_id", filters.actorId);
  }
  if (filters?.resource) {
    query = query.eq("resource", filters.resource);
  }
  if (filters?.action) {
    query = query.eq("action", filters.action);
  }

  return query;
}

export async function createAuditLog(
  client: SupabaseClient,
  entry: {
    actor_id?: string | null;
    actor_email?: string | null;
    action: string;
    resource: string;
    resource_id?: string | null;
    changes?: Record<string, unknown>;
    ip_address?: string | null;
    user_agent?: string | null;
  }
) {
  return client
    .from("audit_logs")
    .insert(entry);
}
