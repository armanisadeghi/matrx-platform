/**
 * API Request/Response Types
 *
 * Shared type definitions for all API endpoints.
 * Used by both web (Next.js API routes) and mobile (fetch calls).
 */

/** Standard API response envelope */
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
  meta?: ApiMeta;
}

/** Standard API error structure */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/** Pagination and metadata for list responses */
export interface ApiMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

/** Paginated list request params */
export interface PaginationParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** Standard API route paths consumed by clients */
export const API_ROUTES = {
  // Auth
  AUTH_CALLBACK: "/api/auth/callback",

  // AI Integration
  AI_CHAT: "/api/ai/chat",
  AI_WORKFLOWS: "/api/ai/workflows",
  AI_AGENTS: "/api/ai/agents",

  // Webhooks
  STRIPE_WEBHOOK: "/api/webhooks/stripe",

  // Health
  HEALTH: "/api/health",
} as const;

export type ApiRoute = (typeof API_ROUTES)[keyof typeof API_ROUTES];
