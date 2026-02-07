"use client";

import { useEffect } from "react";
import { errorReporter } from "@matrx/shared";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    errorReporter.captureError(error, {
      component: "NextErrorBoundary",
      action: "page_render",
      context: { digest: error.digest },
    });
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold text-foreground">
        Something went wrong
      </h1>
      <p className="text-foreground-secondary">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-on-primary transition-colors hover:bg-primary-dark"
      >
        Try Again
      </button>
    </main>
  );
}
