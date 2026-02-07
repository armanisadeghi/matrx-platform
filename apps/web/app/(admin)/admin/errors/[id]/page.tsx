import type { Metadata } from "next";
import { features } from "@/lib/features";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Error Detail",
};

/** Placeholder error group detail for when Supabase is not configured. */
const PLACEHOLDER_ERROR_GROUP = {
  id: "eg_1",
  title: "TypeError: Cannot read properties of undefined (reading 'map')",
  level: "error",
  platform: "web",
  events_count: 142,
  last_seen: "2026-02-07T08:30:00Z",
  first_seen: "2026-02-01T10:00:00Z",
  status: "unresolved",
  fingerprint: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
  culprit: "components/Dashboard/UserList.tsx in renderUsers",
};

/** Placeholder recent events for this error group. */
const PLACEHOLDER_EVENTS = [
  {
    id: "evt_1",
    timestamp: "2026-02-07T08:30:00Z",
    message: "Cannot read properties of undefined (reading 'map')",
    environment: "production",
    user_id: "usr_a1b2c3",
    url: "/dashboard",
    stack_trace:
      "TypeError: Cannot read properties of undefined (reading 'map')\n    at renderUsers (components/Dashboard/UserList.tsx:42:18)\n    at Dashboard (components/Dashboard/index.tsx:15:5)\n    at renderWithHooks (react-dom.js:1234:22)",
  },
  {
    id: "evt_2",
    timestamp: "2026-02-07T07:12:00Z",
    message: "Cannot read properties of undefined (reading 'map')",
    environment: "production",
    user_id: "usr_d4e5f6",
    url: "/dashboard",
    stack_trace:
      "TypeError: Cannot read properties of undefined (reading 'map')\n    at renderUsers (components/Dashboard/UserList.tsx:42:18)\n    at Dashboard (components/Dashboard/index.tsx:15:5)",
  },
  {
    id: "evt_3",
    timestamp: "2026-02-06T22:05:00Z",
    message: "Cannot read properties of undefined (reading 'map')",
    environment: "staging",
    user_id: null,
    url: "/dashboard?preview=true",
    stack_trace:
      "TypeError: Cannot read properties of undefined (reading 'map')\n    at renderUsers (components/Dashboard/UserList.tsx:42:18)",
  },
  {
    id: "evt_4",
    timestamp: "2026-02-06T18:45:00Z",
    message: "Cannot read properties of undefined (reading 'map')",
    environment: "production",
    user_id: "usr_g7h8i9",
    url: "/dashboard/team",
    stack_trace:
      "TypeError: Cannot read properties of undefined (reading 'map')\n    at renderUsers (components/Dashboard/UserList.tsx:42:18)\n    at TeamDashboard (components/Dashboard/TeamView.tsx:28:10)",
  },
  {
    id: "evt_5",
    timestamp: "2026-02-06T14:20:00Z",
    message: "Cannot read properties of undefined (reading 'map')",
    environment: "production",
    user_id: "usr_j0k1l2",
    url: "/dashboard",
    stack_trace:
      "TypeError: Cannot read properties of undefined (reading 'map')\n    at renderUsers (components/Dashboard/UserList.tsx:42:18)\n    at Dashboard (components/Dashboard/index.tsx:15:5)\n    at renderWithHooks (react-dom.js:1234:22)\n    at mountIndeterminateComponent (react-dom.js:5678:13)",
  },
];

interface ErrorGroupDetail {
  id: string;
  title: string;
  level: string;
  platform: string;
  events_count: number;
  last_seen: string;
  first_seen: string;
  status: string;
  fingerprint: string;
  culprit: string;
}

interface ErrorEvent {
  id: string;
  timestamp: string;
  message: string;
  environment: string;
  user_id: string | null;
  url: string;
  stack_trace: string;
}

/**
 * Fetch an error group by ID, or return placeholder data.
 */
async function getErrorGroup(
  id: string
): Promise<ErrorGroupDetail | null> {
  if (!features.errorTracking) {
    return PLACEHOLDER_ERROR_GROUP;
  }

  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("error_groups")
      .select(
        "id, title, level, platform, events_count, last_seen, first_seen, status, fingerprint, culprit"
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return PLACEHOLDER_ERROR_GROUP;
    }

    return data as ErrorGroupDetail;
  } catch {
    return PLACEHOLDER_ERROR_GROUP;
  }
}

/**
 * Fetch recent events for an error group, or return placeholder data.
 */
async function getErrorEvents(groupId: string): Promise<ErrorEvent[]> {
  if (!features.errorTracking) {
    return PLACEHOLDER_EVENTS;
  }

  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("error_events")
      .select(
        "id, timestamp, message, environment, user_id, url, stack_trace"
      )
      .eq("group_id", groupId)
      .order("timestamp", { ascending: false })
      .limit(20);

    if (error || !data) {
      return PLACEHOLDER_EVENTS;
    }

    return data as ErrorEvent[];
  } catch {
    return PLACEHOLDER_EVENTS;
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

function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "\u2026";
}

function LevelBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    fatal: "bg-error-light text-error",
    error: "bg-error-light/60 text-error",
    warning: "bg-warning-light text-warning",
    info: "bg-info-light text-info",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[level] ?? "bg-background-secondary text-foreground-secondary"}`}
    >
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  const styles: Record<string, string> = {
    web: "bg-info-light text-info",
    mobile: "bg-primary-container text-on-primary-container",
    server: "bg-background-tertiary text-foreground-muted",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[platform] ?? "bg-background-secondary text-foreground-secondary"}`}
    >
      {platform.charAt(0).toUpperCase() + platform.slice(1)}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    unresolved: "bg-warning-light text-warning",
    resolved: "bg-success-light text-success",
    ignored: "bg-background-tertiary text-foreground-muted",
    muted: "bg-background-tertiary text-foreground-muted",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? "bg-background-secondary text-foreground-secondary"}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/**
 * Build action buttons based on current status.
 */
function getActionButtons(
  id: string,
  status: string
): Array<{ label: string; action: string; style: string }> {
  const actions: Array<{ label: string; action: string; style: string }> =
    [];

  if (status === "unresolved") {
    actions.push({
      label: "Resolve",
      action: "resolve",
      style:
        "bg-success-light text-success hover:bg-success hover:text-on-success",
    });
    actions.push({
      label: "Ignore",
      action: "ignore",
      style:
        "bg-background-secondary text-foreground-secondary hover:bg-background-tertiary hover:text-foreground",
    });
    actions.push({
      label: "Mute",
      action: "mute",
      style:
        "bg-background-secondary text-foreground-secondary hover:bg-background-tertiary hover:text-foreground",
    });
  } else if (status === "resolved") {
    actions.push({
      label: "Reopen",
      action: "reopen",
      style:
        "bg-warning-light text-warning hover:bg-warning hover:text-on-warning",
    });
    actions.push({
      label: "Ignore",
      action: "ignore",
      style:
        "bg-background-secondary text-foreground-secondary hover:bg-background-tertiary hover:text-foreground",
    });
  } else if (status === "ignored" || status === "muted") {
    actions.push({
      label: "Reopen",
      action: "reopen",
      style:
        "bg-warning-light text-warning hover:bg-warning hover:text-on-warning",
    });
    actions.push({
      label: "Resolve",
      action: "resolve",
      style:
        "bg-success-light text-success hover:bg-success hover:text-on-success",
    });
  }

  return actions;
}

/**
 * Error Group Detail Page
 *
 * Server Component showing error group details, metadata, action buttons,
 * and a table of recent events.
 */
export default async function ErrorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const errorGroup = await getErrorGroup(id);
  const events = await getErrorEvents(id);
  const isPlaceholder = !features.errorTracking;

  if (!errorGroup) {
    return (
      <div className="flex flex-col gap-6">
        <a
          href="/admin/errors"
          className="inline-flex items-center gap-1 text-sm text-foreground-secondary hover:text-foreground"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Back to Errors
        </a>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-foreground-muted">
            Error group not found.
          </p>
        </div>
      </div>
    );
  }

  const actionButtons = getActionButtons(errorGroup.id, errorGroup.status);

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <a
        href="/admin/errors"
        className="inline-flex items-center gap-1 text-sm text-foreground-secondary hover:text-foreground"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        Back to Errors
      </a>

      {/* Feature disabled notice */}
      {isPlaceholder && (
        <div className="rounded-lg border border-border bg-warning-light px-4 py-3">
          <p className="text-sm font-medium text-warning">
            Error tracking feature is disabled. Showing placeholder data.
          </p>
          <p className="mt-1 text-xs text-foreground-secondary">
            Enable the error tracking feature flag and configure Supabase to
            track real errors.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">
            {errorGroup.title}
          </h1>
          <div className="flex items-center gap-2">
            <LevelBadge level={errorGroup.level} />
            <StatusBadge status={errorGroup.status} />
            <PlatformBadge platform={errorGroup.platform} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {actionButtons.map((btn) => (
            <a
              key={btn.action}
              href={`/admin/errors/${errorGroup.id}?action=${btn.action}`}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${btn.style}`}
            >
              {btn.label}
            </a>
          ))}
        </div>
      </div>

      {/* Meta info */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-foreground">Details</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-foreground-muted">
              Fingerprint
            </p>
            <p className="mt-1 font-mono text-sm text-foreground-secondary">
              {truncate(errorGroup.fingerprint, 16)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-foreground-muted">
              Culprit
            </p>
            <p className="mt-1 text-sm text-foreground-secondary">
              {errorGroup.culprit}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-foreground-muted">
              Total Events
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {errorGroup.events_count.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-foreground-muted">
              First Seen
            </p>
            <p className="mt-1 text-sm text-foreground-secondary">
              {formatDateTime(errorGroup.first_seen)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-foreground-muted">
              Last Seen
            </p>
            <p className="mt-1 text-sm text-foreground-secondary">
              {formatRelativeTime(errorGroup.last_seen)} (
              {formatDateTime(errorGroup.last_seen)})
            </p>
          </div>
        </div>
      </div>

      {/* Recent events table */}
      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Events
          </h2>
          <p className="mt-1 text-sm text-foreground-secondary">
            Last {events.length} events for this error group.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background-secondary">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Environment
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  URL
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="transition-colors hover:bg-background-secondary"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground-secondary">
                    {formatRelativeTime(event.timestamp)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                    {truncate(event.message, 50)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        event.environment === "production"
                          ? "bg-error-light/60 text-error"
                          : "bg-info-light text-info"
                      }`}
                    >
                      {event.environment}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-sm text-foreground-secondary">
                    {event.user_id ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground-secondary">
                    {truncate(event.url, 40)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-foreground-muted">
              No events found for this error group.
            </p>
          </div>
        )}
      </div>

      {/* Stack trace preview for latest event */}
      {events.length > 0 && (
        <div className="rounded-xl border border-border bg-surface">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">
              Latest Stack Trace
            </h2>
            <p className="mt-1 text-sm text-foreground-secondary">
              From event {events[0].id} at{" "}
              {formatDateTime(events[0].timestamp)}.
            </p>
          </div>
          <div className="p-6">
            <pre className="overflow-x-auto rounded-lg bg-background-tertiary p-4 font-mono text-xs leading-relaxed text-foreground-secondary">
              {truncate(events[0].stack_trace, 500)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
