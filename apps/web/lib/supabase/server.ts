import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@matrx/supabase";

/**
 * Server-side Supabase client for Next.js.
 *
 * Uses cookie-based auth via @supabase/ssr.
 * Call this in Server Components, Server Actions, and API Routes.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method is called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}
