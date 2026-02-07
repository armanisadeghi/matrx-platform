import type { Metadata } from "next";
import { features } from "@/lib/features";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Errors",
};

/** Placeholder error group data for when Supabase is not configured. */
const PLACEHOLDER_ERROR_GROUPS = [
  {
    id: "eg_1",
    title: "TypeError: Cannot read properties of undefined (reading 'map')",
    level: "error",
    platform: "web",
    events_count: 142,
    last_seen: "2026-02-07T08:30:00Z",
    first_seen: "2026-02-01T10:00:00Z",
    status: "unresolved",
  },
  {
    id: "eg_2",
    title: "ReferenceError: process is not defined",
    level: "fatal",
    platform: "web",
    events_count: 37,
    last_seen: "2026-02-07T07:15:00Z",
    first_seen: "2026-01-28T14:30:00Z",
    status: "unresolved",
  },
  {
    id: "eg_3",
    title: "Network request failed: /api/v1/users",
    level: "warning",
    platform: "mobile",
    events_count: 891,
    last_seen: "2026-02-06T22:45:00Z",
    first_seen: "2026-01-15T09:15:00Z",
    status: "resolved",
  },
  {
    id: "eg_4",
    title: "Unhandled promise rejection in AuthProvider",
    level: "error",
    platform: "web",
    events_count: 56,
    last_seen: "2026-02-05T16:00:00Z",
    first_seen: "2026-02-03T11:00:00Z",
    status: "ignored",
  },
  {
    id: "eg_5",
    title: "Deprecation warning: componentWillMount has been renamed",
    level: "info",
    platform: "web",
    events_count: 2304,
    last_seen: "2026-02-07T09:00:00Z",
    first_seen: "2025-12-10T08:00:00Z",
    status: "muted",
  },
  {
    id: "eg_6",
    title: "FATAL: Out of memory - heap allocation failed",
    level: "fatal",
    platform: "server",
    events_count: 3,
    last_seen: "2026-02-04T03:20:00Z",
    first_seen: "2026-02-04T03:18:00Z",
    status: "unresolved",
  },
  {
    id: "eg_7",
    title: "Warning: Each child in a list should have a unique key prop",
    level: "warning",
    platform: "mobile",
    events_count: 418,
    last_seen: "2026-02-06T19:30:00Z",
    first_seen: "2026-01-20T12:00:00Z",
    status: "muted",
  },
];

interface ErrorGroupRow {
  id: string;
  title: string;
  level: string;
  platform: string;
  events_count: number;
  last_seen: string;
  first_seen: string;
  status: string;
}

/**
 * Fetch error groups from Supabase, or return placeholder data.
 */
async function getErrorGroups(
  statusFilter?: string,
  levelFilter?: string
): Promise<ErrorGroupRow[]> {
  if (!features.errorTracking) {
    return PLACEHOLDER_ERROR_GROUPS;
  }

  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("error_groups")
      .select(
        "id, title, level, platform, events_count, last_seen, first_seen, status"
      )
      .order("last_seen", { ascending: false })
      .limit(50);

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    if (levelFilter && levelFilter !== "all") {
      query = query.eq("level", levelFilter);
    }

    const { data, error } = await query;

    if (error || !data) {
      return PLACEHOLDER_ERROR_GROUPS;
    }

    return data as ErrorGroupRow[];
  } catch {
    return PLACEHOLDER_ERROR_GROUPS;
  }
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

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
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
 * Error Groups Listing Page
 *
 * Server Component with data table, status/level filtering, and feature flag guard.
 * Falls back to placeholder data if error tracking is disabled or Supabase is not configured.
 */
export default async function ErrorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const statusFilter =
    typeof params.status === "string" ? params.status : "all";
  const levelFilter =
    typeof params.level === "string" ? params.level : "all";

  const errorGroups = await getErrorGroups(statusFilter, levelFilter);
  const isPlaceholder = !features.errorTracking;

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "unresolved", label: "Unresolved" },
    { value: "resolved", label: "Resolved" },
    { value: "ignored", label: "Ignored" },
    { value: "muted", label: "Muted" },
  ];

  const levelOptions = [
    { value: "all", label: "All" },
    { value: "fatal", label: "Fatal" },
    { value: "error", label: "Error" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
  ];

  // Build URL with preserved filters
  function buildFilterUrl(
    filterType: "status" | "level",
    value: string
  ): string {
    const newStatus = filterType === "status" ? value : statusFilter;
    const newLevel = filterType === "level" ? value : levelFilter;

    const parts: string[] = [];
    if (newStatus !== "all") parts.push(`status=${newStatus}`);
    if (newLevel !== "all") parts.push(`level=${newLevel}`);

    return parts.length > 0
      ? `/admin/errors?${parts.join("&")}`
      : "/admin/errors";
  }

  // Apply client-side filter for placeholder data
  let filteredGroups = errorGroups;
  if (isPlaceholder) {
    if (statusFilter !== "all") {
      filteredGroups = filteredGroups.filter(
        (g) => g.status === statusFilter
      );
    }
    if (levelFilter !== "all") {
      filteredGroups = filteredGroups.filter(
        (g) => g.level === levelFilter
      );
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Errors</h1>
          <p className="mt-1 text-foreground-secondary">
            Track and manage application errors.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-foreground-muted">
            {filteredGroups.length} error group
            {filteredGroups.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Feature disabled notice */}
      {!features.errorTracking && (
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

      {/* Status filter tabs */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {statusOptions.map((option) => (
            <a
              key={option.value}
              href={buildFilterUrl("status", option.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === option.value
                  ? "bg-primary text-on-primary"
                  : "bg-background-secondary text-foreground-secondary hover:text-foreground"
              }`}
            >
              {option.label}
            </a>
          ))}
        </div>

        {/* Level filter chips */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground-muted">
            Level:
          </span>
          {levelOptions.map((option) => (
            <a
              key={option.value}
              href={buildFilterUrl("level", option.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                levelFilter === option.value
                  ? "bg-primary text-on-primary"
                  : "bg-background-secondary text-foreground-secondary hover:text-foreground"
              }`}
            >
              {option.label}
            </a>
          ))}
        </div>
      </div>

      {/* Error groups table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background-secondary">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Platform
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Events
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Last Seen
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredGroups.map((group) => (
                <tr
                  key={group.id}
                  className="transition-colors hover:bg-background-secondary"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                    <a
                      href={`/admin/errors/${group.id}`}
                      className="hover:text-primary hover:underline"
                    >
                      {truncate(group.title, 60)}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <LevelBadge level={group.level} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <PlatformBadge platform={group.platform} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-foreground-secondary">
                    {formatCount(group.events_count)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground-secondary">
                    {formatRelativeTime(group.last_seen)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={group.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-foreground-muted">
              No error groups found
              {statusFilter !== "all"
                ? ` with status "${statusFilter}"`
                : ""}
              {levelFilter !== "all" ? ` at level "${levelFilter}"` : ""}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
