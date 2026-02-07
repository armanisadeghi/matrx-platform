import { createClient } from "@supabase/supabase-js";
import type { Database } from "@matrx/supabase";

/**
 * Admin Supabase client for server-side operations that need elevated privileges.
 *
 * Uses the service role key — NEVER expose this to the client.
 * Use for CI/CD scripts, webhooks, and background jobs that need to
 * bypass RLS policies.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for admin client"
    );
  }

  return createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
