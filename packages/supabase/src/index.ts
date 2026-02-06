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
  getProfile,
  updateProfile,
  getOrganization,
  getWorkspaces,
  getAiIntegrations,
  createAiIntegration,
} from "./queries";
