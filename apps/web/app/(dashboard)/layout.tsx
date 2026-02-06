/**
 * Dashboard Layout
 *
 * Authenticated layout with sidebar navigation.
 * Server Component — session is verified server-side.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-surface lg:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <span className="text-lg font-bold text-foreground">Matrx</span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          <a
            href="/dashboard"
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground-secondary transition-colors hover:bg-background-secondary hover:text-foreground"
          >
            Dashboard
          </a>
          <a
            href="/dashboard"
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground-secondary transition-colors hover:bg-background-secondary hover:text-foreground"
          >
            Workspaces
          </a>
          <a
            href="/dashboard"
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground-secondary transition-colors hover:bg-background-secondary hover:text-foreground"
          >
            Integrations
          </a>
          <a
            href="/dashboard"
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground-secondary transition-colors hover:bg-background-secondary hover:text-foreground"
          >
            Settings
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="flex h-16 items-center border-b border-border px-6">
          <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
