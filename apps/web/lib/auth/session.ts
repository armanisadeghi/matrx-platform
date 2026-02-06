import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { User as SupabaseUser } from "@supabase/supabase-js";

/**
 * Get the current Supabase auth session from the server.
 *
 * Returns the session object if authenticated, or null if not.
 */
export async function getSession() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Get the currently authenticated user.
 *
 * Uses `getUser()` which validates the JWT against Supabase
 * (more secure than reading session data from the cookie alone).
 *
 * Returns the user object if authenticated, or null if not.
 */
export async function getUser(): Promise<SupabaseUser | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Require authentication to access a page or action.
 *
 * Redirects to /login if there is no authenticated user.
 * Returns the authenticated user on success.
 */
export async function requireAuth(): Promise<SupabaseUser> {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Require admin role to access a page or action.
 *
 * Redirects to /login if not authenticated or if the user
 * does not have an "admin" or "owner" role in their metadata.
 * Returns the authenticated admin user on success.
 */
export async function requireAdmin(): Promise<SupabaseUser> {
  const user = await requireAuth();

  const role = user.user_metadata?.role as string | undefined;

  if (role !== "admin" && role !== "owner") {
    redirect("/login");
  }

  return user;
}
