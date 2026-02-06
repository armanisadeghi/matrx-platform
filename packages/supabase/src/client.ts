import { createClient, type SupabaseClientOptions } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Create a typed Supabase client.
 *
 * This factory is used by both web and mobile apps, each providing
 * their own storage adapter and environment variables.
 *
 * Web: uses cookie-based auth via @supabase/ssr
 * Mobile: uses MMKV storage adapter
 */
export function createSupabaseClient(
  supabaseUrl: string,
  supabaseAnonKey: string,
  options?: SupabaseClientOptions<"public">
) {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      ...options?.auth,
    },
    ...options,
  });
}

export type SupabaseClient = ReturnType<typeof createSupabaseClient>;
