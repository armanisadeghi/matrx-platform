import { resolveFeatures } from "@matrx/shared";

/**
 * Resolved feature flags for the web app.
 *
 * Import this wherever you need to check if a feature is enabled:
 * ```ts
 * import { features } from "@/lib/features";
 * if (features.blog) { ... }
 * ```
 */
export const features = resolveFeatures(process.env);
