/**
 * Dashboard Loading Skeleton
 *
 * Shown while dashboard pages are streaming.
 * Mirrors the dashboard layout structure with animated placeholders.
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Page title skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-background-tertiary" />
        <div className="h-4 w-72 animate-pulse rounded-md bg-background-tertiary" />
      </div>

      {/* Stats cards row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-surface p-6"
          >
            <div className="mb-3 h-4 w-24 animate-pulse rounded-md bg-background-tertiary" />
            <div className="h-8 w-20 animate-pulse rounded-lg bg-background-tertiary" />
            <div className="mt-2 h-3 w-32 animate-pulse rounded-md bg-background-tertiary" />
          </div>
        ))}
      </div>

      {/* Content area — two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 h-5 w-36 animate-pulse rounded-md bg-background-tertiary" />
            {/* Table-like rows */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-t border-border py-4 first:border-t-0 first:pt-0"
              >
                <div className="h-10 w-10 animate-pulse rounded-full bg-background-tertiary" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded-md bg-background-tertiary" />
                  <div className="h-3 w-1/2 animate-pulse rounded-md bg-background-tertiary" />
                </div>
                <div className="h-6 w-16 animate-pulse rounded-full bg-background-tertiary" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar panel */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 h-5 w-28 animate-pulse rounded-md bg-background-tertiary" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <div className="h-4 w-full animate-pulse rounded-md bg-background-tertiary" />
                <div className="mt-1 h-3 w-2/3 animate-pulse rounded-md bg-background-tertiary" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
