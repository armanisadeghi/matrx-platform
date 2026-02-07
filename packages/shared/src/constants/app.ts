/**
 * Application-Wide Constants
 *
 * Shared between web and mobile.
 */

export const APP_NAME = "Matrx";

export const APP_DESCRIPTION =
  "AI-powered enterprise platform for custom integrations and workflows";

/** Cache TTL values in seconds */
export const CACHE_TTL = {
  SHORT: 60,
  MEDIUM: 300,
  LONG: 1800,
  VERY_LONG: 3600,
  DAY: 86400,
} as const;

/** Pagination defaults */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 20,
  MAX_PER_PAGE: 100,
} as const;

/** File upload limits */
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ] as const,
} as const;

/** Supabase storage buckets */
export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  ATTACHMENTS: "attachments",
  PUBLIC: "public",
} as const;

/** Error tracking limits and configuration */
export const ERROR_TRACKING = {
  MAX_BREADCRUMBS: 100,
  MAX_STACK_LENGTH: 65536,
  MAX_MESSAGE_LENGTH: 8192,
  RATE_LIMIT_WINDOW_MINUTES: 5,
  RATE_LIMIT_MAX_PER_WINDOW: 50,
  CLIENT_QUEUE_MAX_SIZE: 50,
  CLIENT_FLUSH_INTERVAL_MS: 5000,
  CLIENT_RETRY_MAX: 3,
  CLIENT_RETRY_DELAY_MS: 1000,
  CLIENT_RATE_LIMIT_PER_FINGERPRINT: 5,
  CLIENT_RATE_LIMIT_WINDOW_MS: 60_000,
  EVENT_RETENTION_DAYS: 90,
} as const;
