/**
 * Database Model Types
 *
 * Application-level data models matching the Supabase schema.
 * These provide a clean camelCase interface over the snake_case DB columns.
 *
 * When Supabase types are regenerated, keep these in sync.
 */

// ============================================================================
// Core
// ============================================================================

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
  role: ProfileRole;
  isActive: boolean;
  lastSignInAt: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type ProfileRole = "super_admin" | "admin" | "member" | "viewer";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  ownerId: string;
  plan: SubscriptionPlan;
  settings: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionPlan = "free" | "starter" | "pro" | "enterprise";

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrgMemberRole;
  invitedBy: string | null;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type OrgMemberRole = "owner" | "admin" | "member" | "viewer";

export interface UserPreferences {
  id: string;
  userId: string;
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  dashboardLayout: Record<string, unknown>;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

// ============================================================================
// Content
// ============================================================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  contentFormat: "markdown" | "html" | "rich_text";
  coverImageUrl: string | null;
  authorId: string;
  categoryId: string | null;
  status: ContentStatus;
  publishedAt: string | null;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[] | null;
  ogImageUrl: string | null;
  viewCount: number;
  readingTimeMinutes: number | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type ContentStatus = "draft" | "published" | "archived";

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DynamicPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  contentType: "html" | "react" | "markdown";
  isSandboxed: boolean;
  customCss: string | null;
  headTags: string | null;
  status: ContentStatus;
  authorId: string;
  publishedAt: string | null;
  layout: PageLayout;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  metadata: Record<string, unknown>;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export type PageLayout = "default" | "full_width" | "sidebar" | "blank";

export interface FileMetadata {
  id: string;
  storagePath: string;
  bucket: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: string;
  organizationId: string | null;
  category: string | null;
  tags: string[];
  description: string | null;
  width: number | null;
  height: number | null;
  blurhash: string | null;
  publicUrl: string | null;
  isPublic: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Platform
// ============================================================================

export interface AppVersion {
  id: string;
  appName: "web" | "mobile_ios" | "mobile_android";
  version: string;
  buildNumber: number | null;
  gitCommitSha: string | null;
  gitBranch: string | null;
  gitTag: string | null;
  environment: "development" | "staging" | "production";
  deploymentProvider: "vercel" | "eas" | "manual" | null;
  deploymentUrl: string | null;
  deploymentId: string | null;
  status: "building" | "deployed" | "failed" | "rolled_back";
  changelog: string | null;
  isCurrent: boolean;
  buildMetadata: Record<string, unknown>;
  deployedBy: string | null;
  deployedAt: string;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  organizationId: string;
  settings: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AiIntegration {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  type: "prompt" | "agent" | "workflow";
  config: Record<string, unknown>;
  isActive: boolean;
  version: number;
  lastExecutedAt: string | null;
  executionCount: number;
  createdAt: string;
  updatedAt: string;
}
