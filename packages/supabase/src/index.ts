/**
 * @matrx/supabase
 *
 * Shared Supabase integration package.
 * Provides typed client factory, database types, and query functions.
 */

export { createSupabaseClient } from "./client";
export type { SupabaseClient } from "./client";

export type {
  Database,
  Tables,
  InsertTables,
  UpdateTables,
  Enums,
} from "./types";

export {
  // Profiles
  getProfile,
  getAllProfiles,
  updateProfile,
  // Organizations
  getOrganization,
  getOrganizationBySlug,
  getUserOrganizations,
  // User Preferences
  getUserPreferences,
  updateUserPreferences,
  // Blog
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getAllBlogPosts,
  getBlogCategories,
  // Dynamic Pages
  getDynamicPageBySlug,
  getAllDynamicPages,
  // Files
  getUserFiles,
  getAllFiles,
  // App Versions
  getAppVersions,
  getCurrentVersion,
  // Workspaces & AI
  getWorkspaces,
  getAiIntegrations,
  createAiIntegration,
} from "./queries";
