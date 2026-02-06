import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome to your dashboard
        </h1>
        <p className="mt-1 text-foreground-secondary">
          Manage your AI integrations, workspaces, and settings.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Integrations", value: "0" },
          { label: "Workspaces", value: "0" },
          { label: "API Calls (30d)", value: "0" },
          { label: "Team Members", value: "1" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-surface p-6"
          >
            <p className="text-sm text-foreground-secondary">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <p className="mt-1 text-sm text-foreground-secondary">
          Get started by setting up your first AI integration.
        </p>
        <div className="mt-4 flex gap-3">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-dark">
            Create Integration
          </button>
          <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background-secondary">
            View Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
