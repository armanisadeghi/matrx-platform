import type { Metadata } from "next";
import { features } from "@/lib/features";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Audit Log",
};

/** Placeholder audit log data for when Supabase is not configured. */
const PLACEHOLDER_AUDIT_LOGS = [
  {
    id: "al_1",
    created_at: "2026-02-07T09:15:00Z",
    actor_email: "alice@example.com",
    actor_id: "usr_a1b2c3",
    action: "user.role.updated",
    resource: "user",
    resource_id: "usr_d4e5f6",
  },
  {
    id: "al_2",
    created_at: "2026-02-07T08:45:00Z",
    actor_email: "alice@example.com",
    actor_id: "usr_a1b2c3",
    action: "blog_post.published",
    resource: "blog_post",
    resource_id: "post_123",
  },
  {
    id: "al_3",
    created_at: "2026-02-06T22:30:00Z",
    actor_email: "bob@example.com",
    actor_id: "usr_g7h8i9",
    action: "page.created",
    resource: "page",
    resource_id: "page_456",
  },
  {
    id: "al_4",
    created_at: "2026-02-06T18:00:00Z",
    actor_email: "alice@example.com",
    actor_id: "usr_a1b2c3",
    action: "settings.updated",
    resource: "settings",
    resource_id: "app_settings",
  },
  {
    id: "al_5",
    created_at: "2026-02-06T14:20:00Z",
    actor_email: "carol@example.com",
    actor_id: "usr_j0k1l2",
    action: "user.deleted",
    resource: "user",
    resource_id: "usr_m3n4o5",
  },
  {
    id: "al_6",
    created_at: "2026-02-05T16:45:00Z",
    actor_email: "alice@example.com",
    actor_id: "usr_a1b2c3",
    action: "error_group.resolved",
    resource: "error_group",
    resource_id: "eg_3",
  },
  {
    id: "al_7",
    created_at: "2026-02-05T10:00:00Z",
    actor_email: "bob@example.com",
    actor_id: "usr_g7h8i9",
    action: "file.uploaded",
    resource: "file",
    resource_id: "file_789",
  },
  {
    id: "al_8",
    created_at: "2026-02-04T09:30:00Z",
    actor_email: "alice@example.com",
    actor_id: "usr_a1b2c3",
    action: "blog_post.deleted",
    resource: "blog_post",
    resource_id: "post_098",
  },
];

interface AuditLogRow {
  id: string;
  created_at: string;
  actor_email: string | null;
  actor_id: string;
  action: string;
  resource: string;
  resource_id: string;
}

/**
 * Fetch audit logs from Supabase, or return placeholder data.
 */
async function getAuditLogs(
  resourceFilter?: string
): Promise<AuditLogRow[]> {
  if (!features.auditLog) {
    return PLACEHOLDER_AUDIT_LOGS;
  }

  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("audit_logs")
      .select(
        "id, created_at, actor_email, actor_id, action, resource, resource_id"
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (resourceFilter && resourceFilter !== "all") {
      query = query.eq("resource", resourceFilter);
    }

    const { data, error } = await query;

    if (error || !data) {
      return PLACEHOLDER_AUDIT_LOGS;
    }

    return data as AuditLogRow[];
  } catch {
    return PLACEHOLDER_AUDIT_LOGS;
  }
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function ActionBadge({ action }: { action: string }) {
  let style = "bg-background-secondary text-foreground-secondary";

  if (action.includes("deleted")) {
    style = "bg-error-light text-error";
  } else if (action.includes("created") || action.includes("uploaded")) {
    style = "bg-success-light text-success";
  } else if (action.includes("updated") || action.includes("published")) {
    style = "bg-info-light text-info";
  } else if (action.includes("resolved")) {
    style = "bg-success-light text-success";
  }

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${style}`}
    >
      {action}
    </span>
  );
}

function ResourceBadge({ resource }: { resource: string }) {
  const styles: Record<string, string> = {
    user: "bg-primary-container text-on-primary-container",
    blog_post: "bg-info-light text-info",
    page: "bg-warning-light text-warning",
    settings: "bg-background-tertiary text-foreground-muted",
    error_group: "bg-error-light/60 text-error",
    file: "bg-success-light text-success",
  };

  const labels: Record<string, string> = {
    user: "User",
    blog_post: "Blog Post",
    page: "Page",
    settings: "Settings",
    error_group: "Error Group",
    file: "File",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[resource] ?? "bg-background-secondary text-foreground-secondary"}`}
    >
      {labels[resource] ?? resource}
    </span>
  );
}

/**
 * Audit Log Page
 *
 * Server Component with data table, resource filtering, and feature flag guard.
 * Falls back to placeholder data if audit logging is disabled or Supabase is not configured.
 */
export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const resourceFilter =
    typeof params.resource === "string" ? params.resource : "all";

  const auditLogs = await getAuditLogs(resourceFilter);
  const isPlaceholder = !features.auditLog;

  const resourceOptions = [
    { value: "all", label: "All" },
    { value: "user", label: "User" },
    { value: "blog_post", label: "Blog Post" },
    { value: "page", label: "Page" },
    { value: "settings", label: "Settings" },
    { value: "error_group", label: "Error Group" },
    { value: "file", label: "File" },
  ];

  // Apply client-side filter for placeholder data
  const filteredLogs =
    isPlaceholder && resourceFilter !== "all"
      ? auditLogs.filter((l) => l.resource === resourceFilter)
      : auditLogs;

  return (
    <div className="flex flex-col gap-6">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
          <p className="mt-1 text-foreground-secondary">
            Track administrative actions and changes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-foreground-muted">
            {filteredLogs.length} event{filteredLogs.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Feature disabled notice */}
      {!features.auditLog && (
        <div className="rounded-lg border border-border bg-warning-light px-4 py-3">
          <p className="text-sm font-medium text-warning">
            Audit log feature is disabled. Showing placeholder data.
          </p>
          <p className="mt-1 text-xs text-foreground-secondary">
            Enable the audit log feature flag and configure Supabase to track
            real audit events.
          </p>
        </div>
      )}

      {/* Resource filter chips */}
      <div className="flex items-center gap-2">
        {resourceOptions.map((option) => (
          <a
            key={option.value}
            href={
              option.value === "all"
                ? "/admin/audit"
                : `/admin/audit?resource=${option.value}`
            }
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              resourceFilter === option.value
                ? "bg-primary text-on-primary"
                : "bg-background-secondary text-foreground-secondary hover:text-foreground"
            }`}
          >
            {option.label}
          </a>
        ))}
      </div>

      {/* Audit log table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background-secondary">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Actor
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Resource ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="transition-colors hover:bg-background-secondary"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground-secondary">
                    <span title={formatDateTime(log.created_at)}>
                      {formatRelativeTime(log.created_at)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                    {log.actor_email ?? (
                      <span className="font-mono text-foreground-secondary">
                        {log.actor_id}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <ActionBadge action={log.action} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <ResourceBadge resource={log.resource} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-sm text-foreground-secondary">
                    {log.resource_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-foreground-muted">
              No audit log entries found
              {resourceFilter !== "all"
                ? ` for resource "${resourceFilter}"`
                : ""}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
