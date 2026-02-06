/**
 * Dynamic Page — Loading Skeleton
 *
 * Shown while the dynamic page content streams in.
 */
export default function DynamicPageLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Title skeleton */}
        <div className="mb-8">
          <div className="h-10 w-2/3 animate-pulse rounded-lg bg-background-tertiary" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-background-tertiary" />
          <div className="h-4 w-full animate-pulse rounded bg-background-tertiary" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-background-tertiary" />
          <div className="h-4 w-full animate-pulse rounded bg-background-tertiary" />

          <div className="h-8 w-56 animate-pulse rounded-lg bg-background-tertiary" />

          <div className="h-4 w-full animate-pulse rounded bg-background-tertiary" />
          <div className="h-4 w-full animate-pulse rounded bg-background-tertiary" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-background-tertiary" />
          <div className="h-4 w-full animate-pulse rounded bg-background-tertiary" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-background-tertiary" />

          <div className="h-48 w-full animate-pulse rounded-lg bg-background-tertiary" />

          <div className="h-4 w-full animate-pulse rounded bg-background-tertiary" />
          <div className="h-4 w-full animate-pulse rounded bg-background-tertiary" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-background-tertiary" />
          <div className="h-4 w-full animate-pulse rounded bg-background-tertiary" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-background-tertiary" />
        </div>
      </div>
    </div>
  );
}
