/**
 * Feature Flags
 *
 * Environment-based feature toggling system.
 *
 * How it works:
 * - Each feature maps to an env var (NEXT_PUBLIC_ for web, EXPO_PUBLIC_ for mobile)
 * - If the env var is not set, the feature uses its default value
 * - Features can be checked at runtime: `if (features.blog) { ... }`
 * - Missing env vars never cause errors — features simply stay disabled
 *
 * To enable a feature, set the corresponding env var to "true" in your .env file.
 * To disable, set to "false" or remove the variable entirely.
 */

export interface FeatureFlags {
  /** Supabase authentication (login, register, sessions) */
  auth: boolean;
  /** Admin portal (/admin routes) */
  adminPortal: boolean;
  /** Blog system (/blog routes + API) */
  blog: boolean;
  /** Dynamic DB-stored pages (/p/[slug] routes) */
  dynamicPages: boolean;
  /** Supabase file storage (upload, manage files) */
  fileStorage: boolean;
  /** Stripe payment integration */
  stripe: boolean;
  /** AI integration features (prompts, agents, workflows) */
  aiIntegration: boolean;
  /** Real-time features (Supabase Realtime) */
  realtime: boolean;
  /** Version tracking (build/deployment history) */
  versionTracking: boolean;
  /** GitHub webhook integration */
  githubWebhook: boolean;
  /** Vercel deployment webhook */
  vercelWebhook: boolean;
  /** Error tracking system (collection, admin dashboard) */
  errorTracking: boolean;
  /** Audit logging (admin action history) */
  auditLog: boolean;
}

/** Default feature flag values (used when env vars are missing) */
export const DEFAULT_FEATURES: FeatureFlags = {
  auth: true,
  adminPortal: true,
  blog: true,
  dynamicPages: true,
  fileStorage: true,
  stripe: false,
  aiIntegration: false,
  realtime: false,
  versionTracking: true,
  githubWebhook: false,
  vercelWebhook: false,
  errorTracking: true,
  auditLog: true,
};

/**
 * Environment variable names for each feature.
 * Web uses NEXT_PUBLIC_ prefix, mobile uses EXPO_PUBLIC_ prefix.
 * The resolver function handles both.
 */
export const FEATURE_ENV_KEYS: Record<keyof FeatureFlags, string> = {
  auth: "FEATURE_AUTH",
  adminPortal: "FEATURE_ADMIN_PORTAL",
  blog: "FEATURE_BLOG",
  dynamicPages: "FEATURE_DYNAMIC_PAGES",
  fileStorage: "FEATURE_FILE_STORAGE",
  stripe: "FEATURE_STRIPE",
  aiIntegration: "FEATURE_AI_INTEGRATION",
  realtime: "FEATURE_REALTIME",
  versionTracking: "FEATURE_VERSION_TRACKING",
  githubWebhook: "FEATURE_GITHUB_WEBHOOK",
  vercelWebhook: "FEATURE_VERCEL_WEBHOOK",
  errorTracking: "FEATURE_ERROR_TRACKING",
  auditLog: "FEATURE_AUDIT_LOG",
};

/**
 * Resolve a feature flag value from environment variables.
 *
 * Checks for the env var with both NEXT_PUBLIC_ and EXPO_PUBLIC_ prefixes.
 * Falls back to the default value if neither is set.
 */
function resolveFeature(
  key: keyof FeatureFlags,
  env: Record<string, string | undefined>
): boolean {
  const envKey = FEATURE_ENV_KEYS[key];

  // Check all possible prefixes
  const value =
    env[`NEXT_PUBLIC_${envKey}`] ??
    env[`EXPO_PUBLIC_${envKey}`] ??
    env[envKey];

  if (value === undefined) {
    return DEFAULT_FEATURES[key];
  }

  return value === "true" || value === "1";
}

/**
 * Create a resolved feature flags object from environment variables.
 *
 * Usage:
 * ```ts
 * // In Next.js
 * const features = resolveFeatures(process.env);
 *
 * // In Expo
 * const features = resolveFeatures(process.env);
 *
 * if (features.blog) {
 *   // Blog feature is enabled
 * }
 * ```
 */
export function resolveFeatures(
  env: Record<string, string | undefined>
): FeatureFlags {
  const flags = {} as FeatureFlags;
  for (const key of Object.keys(DEFAULT_FEATURES) as Array<keyof FeatureFlags>) {
    flags[key] = resolveFeature(key, env);
  }
  return flags;
}

/**
 * Check if required environment variables are present for a feature.
 * Returns an array of missing variable names, or empty if all are present.
 */
export function checkFeatureDependencies(
  feature: keyof FeatureFlags,
  env: Record<string, string | undefined>
): string[] {
  const deps: Record<string, string[]> = {
    auth: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    stripe: ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"],
    aiIntegration: ["MATRX_AI_BACKEND_URL", "MATRX_AI_API_KEY"],
    githubWebhook: ["GITHUB_WEBHOOK_SECRET"],
    vercelWebhook: ["VERCEL_WEBHOOK_SECRET"],
    fileStorage: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    blog: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    dynamicPages: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    adminPortal: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    realtime: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    versionTracking: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    errorTracking: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    auditLog: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
  };

  const required = deps[feature] ?? [];
  return required.filter((key) => !env[key]);
}
