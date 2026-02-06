import type { SupabaseClient } from "../client";

/**
 * Shared Query Functions
 *
 * Type-safe query builders used by both web and mobile.
 * Each function takes a Supabase client instance to remain
 * environment-agnostic (server vs. client).
 */

export async function getProfile(client: SupabaseClient, userId: string) {
  return client
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
}

export async function updateProfile(
  client: SupabaseClient,
  userId: string,
  data: { display_name?: string; bio?: string; avatar_url?: string }
) {
  return client
    .from("profiles")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select()
    .single();
}

export async function getOrganization(client: SupabaseClient, orgId: string) {
  return client
    .from("organizations")
    .select("*")
    .eq("id", orgId)
    .single();
}

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
    type: string;
    config?: Record<string, unknown>;
  }
) {
  return client
    .from("ai_integrations")
    .insert({ ...data, is_active: true })
    .select()
    .single();
}
