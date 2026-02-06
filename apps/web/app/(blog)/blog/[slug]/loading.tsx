/**
 * Blog Post Detail — Loading Skeleton
 *
 * Shown while the individual blog post page streams in.
 */
export default function BlogPostLoading() {
  return (
    <article>
      {/* Back link skeleton */}
      <div className="mb-8 h-5 w-24 animate-pulse rounded bg-background-tertiary" />

      {/* Tags skeleton */}
      <div className="mb-4 flex gap-2">
        <div className="h-6 w-16 animate-pulse rounded-full bg-background-tertiary" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-background-tertiary" />
        <div className="h-6 w-14 animate-pulse rounded-full bg-background-tertiary" />
      </div>

      {/* Title skeleton */}
      <div className="h-10 w-full animate-pulse rounded-lg bg-background-tertiary" />
      <div className="mt-2 h-10 w-3/4 animate-pulse rounded-lg bg-background-tertiary" />

      {/* Meta row skeleton */}
      <div className="mt-6 flex items-center gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-background-tertiary" />
          <div>
            <div className="h-4 w-28 animate-pulse rounded bg-background-tertiary" />
            <div className="mt-1 h-3 w-40 animate-pulse rounded bg-background-tertiary" />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="h-4 w-28 animate-pulse rounded bg-background-tertiary" />
          <div className="h-4 w-20 animate-pulse rounded bg-background-tertiary" />
        </div>
      </div>

      {/* Cover image skeleton */}
      <div className="my-8 aspect-[2/1] animate-pulse rounded-xl bg-background-tertiary" />

      {/* Content body skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-full animate-pulse rounded bg-background-tertiary" />
        <div className="h-4 w-full animate-pulse rounded bg-background-tertiary" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-background-tertiary" />
        <div className="h-4 w-full animate-pulse rounded bg-background-tertiary" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-background-tertiary" />

        <div className="h-8 w-48 animate-pulse rounded-lg bg-background-tertiary" />

        <div className="h-4 w-full animate-pulse rounded bg-background-tertiary" />
        <div className="h-4 w-full animate-pulse rounded bg-background-tertiary" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-background-tertiary" />

        <div className="h-24 w-full animate-pulse rounded-lg bg-background-tertiary" />

        <div className="h-4 w-full animate-pulse rounded bg-background-tertiary" />
        <div className="h-4 w-full animate-pulse rounded bg-background-tertiary" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-background-tertiary" />
      </div>

      {/* Footer skeleton */}
      <div className="mt-12 border-t border-border pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 animate-pulse rounded-full bg-background-tertiary" />
            <div>
              <div className="h-5 w-32 animate-pulse rounded bg-background-tertiary" />
              <div className="mt-1 h-4 w-48 animate-pulse rounded bg-background-tertiary" />
            </div>
          </div>
          <div className="h-10 w-28 animate-pulse rounded-lg bg-background-tertiary" />
        </div>
      </div>
    </article>
  );
}
