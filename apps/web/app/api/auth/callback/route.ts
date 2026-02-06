import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Supabase Auth Callback
 *
 * Handles the OAuth callback from Supabase Auth.
 * Exchanges the auth code for a session and sets cookies.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(redirect, origin));
    }
  }

  // Auth code exchange failed — redirect to login with error
  return NextResponse.redirect(
    new URL("/login?error=auth_callback_failed", origin)
  );
}
