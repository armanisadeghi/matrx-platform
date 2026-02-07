import { errorReporter } from "@matrx/shared";
import { features } from "@/lib/features";

/**
 * Web Error Tracking
 *
 * Initializes the shared error reporter with web-specific settings.
 * Call `initErrorTracking()` once at app startup (client-side only).
 *
 * Also installs global handlers for uncaught errors and unhandled
 * promise rejections so they're automatically reported.
 */

let initialized = false;

export function initErrorTracking() {
  if (initialized) return;
  initialized = true;

  errorReporter.init({
    endpoint: "/api/errors",
    platform: "web",
    environment: process.env.NODE_ENV ?? "production",
    release: process.env.NEXT_PUBLIC_BUILD_ID ?? "",
    enabled: features.errorTracking,
    defaultTags: { app: "web" },
    getUrl: () =>
      typeof window !== "undefined" ? window.location.href : undefined,
    debug: process.env.NODE_ENV === "development",
  });

  if (typeof window !== "undefined") {
    window.addEventListener("error", (event) => {
      errorReporter.captureError(event.error ?? event.message, {
        action: "uncaught_exception",
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    window.addEventListener("unhandledrejection", (event) => {
      errorReporter.captureError(event.reason, {
        action: "unhandled_promise_rejection",
      });
    });
  }
}
