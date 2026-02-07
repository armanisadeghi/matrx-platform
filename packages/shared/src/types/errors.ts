/**
 * Error Tracking Types
 *
 * Shared types for the error tracking system.
 * Used by web, mobile, and server-side code.
 */

export type ErrorLevel = "fatal" | "error" | "warning" | "info";
export type ErrorStatus = "unresolved" | "resolved" | "ignored" | "muted";
export type ErrorPlatform = "web" | "mobile_ios" | "mobile_android" | "server";

export interface ErrorGroup {
  id: string;
  fingerprint: string;
  title: string;
  culprit: string | null;
  platform: ErrorPlatform;
  level: ErrorLevel;
  status: ErrorStatus;
  firstSeenAt: string;
  lastSeenAt: string;
  eventCount: number;
  userCount: number;
  assignedTo: string | null;
  resolvedAt: string | null;
  resolvedBy: string | null;
  tags: Record<string, string>;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ErrorEvent {
  id: string;
  groupId: string;
  message: string;
  stackTrace: string | null;
  platform: ErrorPlatform;
  environment: string;
  release: string | null;
  userId: string | null;
  userAgent: string | null;
  url: string | null;
  component: string | null;
  action: string | null;
  breadcrumbs: ErrorBreadcrumb[];
  context: Record<string, unknown>;
  tags: Record<string, string>;
  createdAt: string;
}

export interface ErrorBreadcrumb {
  timestamp: string;
  category: string;
  message: string;
  level: ErrorLevel;
  data?: Record<string, unknown>;
}

/** Payload sent by clients to the ingestion API */
export interface ErrorReportPayload {
  message: string;
  stackTrace?: string;
  level?: ErrorLevel;
  platform: ErrorPlatform;
  environment?: string;
  release?: string;
  userId?: string;
  url?: string;
  component?: string;
  action?: string;
  breadcrumbs?: ErrorBreadcrumb[];
  context?: Record<string, unknown>;
  tags?: Record<string, string>;
  fingerprint?: string;
}

/** Extra context passed when capturing an error */
export interface CaptureExtras {
  component?: string;
  action?: string;
  tags?: Record<string, string>;
  context?: Record<string, unknown>;
  level?: ErrorLevel;
  fingerprint?: string;
}

/** Audit log entry */
export interface AuditLogEntry {
  id: string;
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  changes: Record<string, unknown>;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}
