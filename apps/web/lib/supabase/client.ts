"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@matrx/supabase";

/**
 * Browser-side Supabase client for Next.js.
 *
 * Uses cookie-based auth via @supabase/ssr.
 * Call this in Client Components.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
