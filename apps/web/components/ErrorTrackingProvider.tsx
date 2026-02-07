"use client";

import { useEffect } from "react";
import { initErrorTracking } from "@/lib/error-tracking";

/**
 * Client-side error tracking initializer.
 *
 * Mount this once in the root layout. It initializes the error reporter
 * and installs global error/rejection handlers on first render.
 * Renders nothing — purely a side-effect component.
 */
export function ErrorTrackingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initErrorTracking();
  }, []);

  return <>{children}</>;
}
