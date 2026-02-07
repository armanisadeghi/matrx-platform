import type { Metadata } from "next";
import { features } from "@/lib/features";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

/**
 * Admin Dashboard
 *
 * Overview page with stat cards, quick actions, and recent activity.
 */
export default function AdminDashboardPage() {
  const stats = [
    {
      label: "Total Users",
      value: "—",
      description: "Registered accounts",
      enabled: features.auth,
    },
    {
      label: "Blog Posts",
      value: "—",
      description: "Published & drafts",
      enabled: features.blog,
    },
    {
      label: "Pages",
      value: "—",
      description: "Dynamic pages",
      enabled: features.dynamicPages,
    },
    {
      label: "Files",
      value: "—",
      description: "Uploaded files",
      enabled: features.fileStorage,
    },
    {
      label: "Unresolved Errors",
      value: "—",
      description: "Active error groups",
      enabled: features.errorTracking,
    },
    {
      label: "Audit Events",
      value: "—",
      description: "Admin actions logged",
      enabled: features.auditLog,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-foreground-secondary">
          Overview of your application.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-surface p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground-secondary">
                {stat.label}
              </p>
              {!stat.enabled && (
                <span className="rounded-full bg-background-secondary px-2 py-0.5 text-xs text-foreground-muted">
                  Disabled
                </span>
              )}
            </div>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-foreground-muted">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <p className="mt-1 text-sm text-foreground-secondary">
          Common administrative tasks.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/admin/users"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-dark"
          >
            Manage Users
          </a>
          <a
            href="/admin/blog"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background-secondary"
          >
            Manage Blog Posts
          </a>
          <a
            href="/admin/pages"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background-secondary"
          >
            Manage Pages
          </a>
          <a
            href="/admin/files"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background-secondary"
          >
            Manage Files
          </a>
          <a
            href="/admin/settings"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background-secondary"
          >
            Settings
          </a>
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Recent Activity
        </h2>
        <p className="mt-1 text-sm text-foreground-secondary">
          Latest actions across your application.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center py-8">
          <svg
            className="h-12 w-12 text-foreground-muted"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <p className="mt-3 text-sm text-foreground-muted">
            No recent activity to display.
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            Activity will appear here as users interact with the application.
          </p>
        </div>
      </div>
    </div>
  );
}
