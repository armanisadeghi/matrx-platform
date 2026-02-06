"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema, emailSchema } from "@matrx/shared";

/**
 * Sign in with email and password.
 *
 * Validates input against the shared loginSchema,
 * then authenticates via Supabase Auth.
 */
export async function signInWithEmail(formData: FormData) {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  const result = loginSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
  });

  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join(", ");
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  const { email, password } = result.data;
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

/**
 * Register a new account with email, password, and full name.
 *
 * Validates input against the shared registerSchema,
 * then creates a new user via Supabase Auth.
 */
export async function signUpWithEmail(formData: FormData) {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");
  const rawFullName = formData.get("fullName");

  const result = registerSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
    fullName: rawFullName,
  });

  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join(", ");
    redirect(`/register?error=${encodeURIComponent(message)}`);
  }

  const { email, password, fullName } = result.data;
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `/login?success=${encodeURIComponent("Check your email to confirm your account.")}`
  );
}

/**
 * Sign out the current user and redirect to the login page.
 */
export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Send a password reset email to the provided address.
 *
 * Validates the email, then sends the reset link via Supabase Auth.
 */
export async function resetPassword(formData: FormData) {
  const rawEmail = formData.get("email");

  const result = emailSchema.safeParse(rawEmail);

  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join(", ");
    redirect(`/forgot-password?error=${encodeURIComponent(message)}`);
  }

  const email = result.data;
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
  });

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `/forgot-password?success=${encodeURIComponent("Check your email for a password reset link.")}`
  );
}
