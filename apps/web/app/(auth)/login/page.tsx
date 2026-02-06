import type { Metadata } from "next";
import { APP_NAME } from "@matrx/shared";
import { signInWithEmail } from "@/lib/auth/actions";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-8 shadow-sm">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Sign in to {APP_NAME}
        </h1>
        <p className="text-sm text-foreground-secondary">
          Enter your credentials to access your account
        </p>
      </div>

      <AuthForm mode="login" action={signInWithEmail} />

      <p className="text-center text-sm text-foreground-secondary">
        Don&apos;t have an account?{" "}
        <a href="/register" className="font-medium text-primary hover:underline">
          Create one
        </a>
      </p>
    </div>
  );
}
