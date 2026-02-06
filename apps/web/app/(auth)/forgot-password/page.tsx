import type { Metadata } from "next";
import { APP_NAME } from "@matrx/shared";
import { resetPassword } from "@/lib/auth/actions";
import { ForgotPasswordForm } from "./form";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-8 shadow-sm">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Reset your password
        </h1>
        <p className="text-sm text-foreground-secondary">
          Enter the email address associated with your {APP_NAME} account and
          we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <ForgotPasswordForm action={resetPassword} />

      <p className="text-center text-sm text-foreground-secondary">
        Remember your password?{" "}
        <a href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
