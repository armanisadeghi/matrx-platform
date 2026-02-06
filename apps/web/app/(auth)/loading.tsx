/**
 * Auth Loading Skeleton
 *
 * Shown while auth pages (login, register) are loading.
 * Centered card skeleton matching the auth layout.
 */
export default function AuthLoading() {
  return (
    <div className="w-full space-y-6 rounded-xl border border-border bg-surface p-8">
      {/* Logo / brand placeholder */}
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-lg bg-background-tertiary" />
        <div className="h-6 w-24 animate-pulse rounded-md bg-background-tertiary" />
        <div className="h-4 w-48 animate-pulse rounded-md bg-background-tertiary" />
      </div>

      {/* Form field skeletons */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-16 animate-pulse rounded-md bg-background-tertiary" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-background-tertiary" />
        </div>

        <div className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded-md bg-background-tertiary" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-background-tertiary" />
        </div>
      </div>

      {/* Submit button skeleton */}
      <div className="h-10 w-full animate-pulse rounded-lg bg-primary/20" />

      {/* Footer link skeleton */}
      <div className="flex justify-center">
        <div className="h-4 w-40 animate-pulse rounded-md bg-background-tertiary" />
      </div>
    </div>
  );
}
