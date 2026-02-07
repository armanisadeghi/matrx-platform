import type { SupabaseClient } from "../client";

/**
 * Shared Query Functions
 *
 * Type-safe query builders used by both web and mobile.
 * Each function takes a Supabase client instance to remain
 * environment-agnostic (server vs. client).
 */

// ============================================================================
// Profiles
// ============================================================================

export async function getProfile(client: SupabaseClient, userId: string) {
  return client
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
}

export async function getAllProfiles(client: SupabaseClient) {
  return client
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function updateProfile(
  client: SupabaseClient,
  userId: string,
  data: { display_name?: string; bio?: string; avatar_url?: string; role?: string }
) {
  return client
    .from("profiles")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select()
    .single();
}

// ============================================================================
// Organizations
// ============================================================================

export async function getOrganization(client: SupabaseClient, orgId: string) {
  return client
    .from("organizations")
    .select("*")
    .eq("id", orgId)
    .single();
}

export async function getOrganizationBySlug(client: SupabaseClient, slug: string) {
  return client
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .single();
}

export async function getUserOrganizations(client: SupabaseClient, userId: string) {
  return client
    .from("organization_members")
    .select("*, organization:organizations(*)")
    .eq("user_id", userId);
}

// ============================================================================
// User Preferences
// ============================================================================

export async function getUserPreferences(client: SupabaseClient, userId: string) {
  return client
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();
}

export async function updateUserPreferences(
  client: SupabaseClient,
  userId: string,
  data: Record<string, unknown>
) {
  return client
    .from("user_preferences")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select()
    .single();
}

// ============================================================================
// Blog
// ============================================================================

export async function getPublishedBlogPosts(
  client: SupabaseClient,
  options?: { limit?: number; offset?: number }
) {
  let query = client
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit ?? 20) - 1);

  return query;
}

export async function getBlogPostBySlug(client: SupabaseClient, slug: string) {
  return client
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();
}

export async function getAllBlogPosts(client: SupabaseClient) {
  return client
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function getBlogCategories(client: SupabaseClient) {
  return client
    .from("blog_categories")
    .select("*")
    .order("sort_order", { ascending: true });
}

// ============================================================================
// Dynamic Pages
// ============================================================================

export async function getDynamicPageBySlug(client: SupabaseClient, slug: string) {
  return client
    .from("dynamic_pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
}

export async function getAllDynamicPages(client: SupabaseClient) {
  return client
    .from("dynamic_pages")
    .select("*")
    .order("updated_at", { ascending: false });
}

// ============================================================================
// File Metadata
// ============================================================================

export async function getUserFiles(client: SupabaseClient, userId: string) {
  return client
    .from("file_metadata")
    .select("*")
    .eq("uploaded_by", userId)
    .order("created_at", { ascending: false });
}

export async function getAllFiles(client: SupabaseClient) {
  return client
    .from("file_metadata")
    .select("*")
    .order("created_at", { ascending: false });
}

// ============================================================================
// App Versions
// ============================================================================

export async function getAppVersions(
  client: SupabaseClient,
  filters?: { app_name?: string; environment?: string }
) {
  let query = client
    .from("app_versions")
    .select("*")
    .order("deployed_at", { ascending: false });

  if (filters?.app_name) query = query.eq("app_name", filters.app_name);
  if (filters?.environment) query = query.eq("environment", filters.environment);

  return query;
}

export async function getCurrentVersion(
  client: SupabaseClient,
  appName: string,
  environment = "production"
) {
  return client
    .from("app_versions")
    .select("*")
    .eq("app_name", appName)
    .eq("environment", environment)
    .eq("is_current", true)
    .single();
}

// ============================================================================
// Workspaces & AI Integrations
// ============================================================================

export async function getWorkspaces(client: SupabaseClient, orgId: string) {
  return client
    .from("workspaces")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });
}

export async function getAiIntegrations(
  client: SupabaseClient,
  workspaceId: string
) {
  return client
    .from("ai_integrations")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
}

export async function createAiIntegration(
  client: SupabaseClient,
  data: {
    workspace_id: string;
    name: string;
    description?: string;
    type: "prompt" | "agent" | "workflow";
    config?: Record<string, unknown>;
  }
) {
  return client
    .from("ai_integrations")
    .insert({ ...data, is_active: true })
    .select()
    .single();
}

// ============================================================================
// Error Tracking & Audit (re-exported from errors.ts)
// ============================================================================

export {
  getErrorGroups,
  getErrorGroupById,
  updateErrorGroupStatus,
  assignErrorGroup,
  deleteErrorGroup,
  getErrorGroupStats,
  getErrorEvents,
  getErrorEventById,
  getAuditLogs,
  createAuditLog,
} from "./errors";
