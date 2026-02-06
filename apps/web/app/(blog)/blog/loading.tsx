/**
 * Blog Listing — Loading Skeleton
 *
 * Shown while the blog listing page streams in.
 */
export default function BlogListingLoading() {
  return (
    <>
      {/* Header skeleton */}
      <div className="mb-10">
        <div className="h-9 w-32 animate-pulse rounded-lg bg-background-tertiary" />
        <div className="mt-3 h-5 w-80 animate-pulse rounded-lg bg-background-tertiary" />
      </div>

      {/* Post cards grid skeleton */}
      <div className="grid gap-8 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-border bg-surface"
          >
            {/* Cover image skeleton */}
            <div className="aspect-[16/9] animate-pulse bg-background-tertiary" />

            {/* Content skeleton */}
            <div className="p-5">
              {/* Tags */}
              <div className="mb-3 flex gap-2">
                <div className="h-5 w-14 animate-pulse rounded-full bg-background-tertiary" />
                <div className="h-5 w-18 animate-pulse rounded-full bg-background-tertiary" />
              </div>

              {/* Title */}
              <div className="h-6 w-full animate-pulse rounded-lg bg-background-tertiary" />
              <div className="mt-1.5 h-6 w-3/4 animate-pulse rounded-lg bg-background-tertiary" />

              {/* Excerpt */}
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-background-tertiary" />
              <div className="mt-1.5 h-4 w-5/6 animate-pulse rounded bg-background-tertiary" />

              {/* Meta row */}
              <div className="mt-5 flex items-center gap-3">
                <div className="h-6 w-6 animate-pulse rounded-full bg-background-tertiary" />
                <div className="h-3 w-20 animate-pulse rounded bg-background-tertiary" />
                <div className="h-3 w-16 animate-pulse rounded bg-background-tertiary" />
                <div className="h-3 w-16 animate-pulse rounded bg-background-tertiary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
