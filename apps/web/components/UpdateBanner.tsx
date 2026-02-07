"use client";

import { useState } from "react";
import { useAppVersion } from "@/hooks/useAppVersion";

interface UpdateBannerProps {
  /**
   * How often to check for updates (in milliseconds).
   * Default: 5 minutes (300_000ms)
   */
  pollingInterval?: number;

  /**
   * Check for updates on route changes.
   * Default: true
   */
  checkOnRouteChange?: boolean;

  /**
   * Position of the banner.
   * Default: "top"
   */
  position?: "top" | "bottom";

  /**
   * Custom className for the banner container.
   */
  className?: string;
}

// ── Inline SVG icons (no external icon library dependency) ──────────

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

/**
 * UpdateBanner Component
 *
 * Displays a non-intrusive banner when a new version of the app is available.
 * Uses the `useAppVersion` hook for version tracking and polling.
 *
 * @example
 * ```tsx
 * <UpdateBanner pollingInterval={300_000} checkOnRouteChange />
 * ```
 */
export function UpdateBanner({
  pollingInterval = 300_000,
  checkOnRouteChange = true,
  position = "top",
  className,
}: UpdateBannerProps) {
  const [isReloading, setIsReloading] = useState(false);

  const { isUpdateAvailable, latestVersion, reloadApp, dismissUpdate } =
    useAppVersion({
      pollingInterval,
      checkOnRouteChange,
      debug: process.env.NODE_ENV === "development",
    });

  const handleReload = async () => {
    setIsReloading(true);
    await reloadApp();
  };

  if (!isUpdateAvailable) return null;

  const positionClass =
    position === "top" ? "top-0" : "bottom-0";

  return (
    <div
      className={[
        "fixed left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",
        "animate-in slide-in-from-top-2 fade-in duration-300",
        positionClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="alert"
      aria-live="polite"
    >
      <div className="mx-auto max-w-7xl px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Message */}
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div className="shrink-0 rounded-full bg-white/20 p-1.5 sm:p-2">
              <RefreshIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                <span className="sm:hidden">New update</span>
                <span className="hidden sm:inline">
                  A new version is available
                </span>
                {latestVersion && (
                  <span className="ml-2 hidden text-xs opacity-90 sm:inline">
                    (v{latestVersion.version})
                  </span>
                )}
              </p>
              <p className="hidden text-xs opacity-90 sm:block">
                Click reload to get the latest features and fixes
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleReload}
              disabled={isReloading}
              className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 disabled:cursor-not-allowed disabled:opacity-70 sm:px-4 sm:py-2"
            >
              {isReloading ? (
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <SpinnerIcon className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">
                    Updating...
                  </span>
                  <span className="sm:hidden">...</span>
                </span>
              ) : (
                "Reload"
              )}
            </button>
            <button
              onClick={dismissUpdate}
              disabled={isReloading}
              className="rounded-lg p-1.5 transition-colors duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2"
              aria-label="Dismiss update notification"
            >
              <CloseIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
