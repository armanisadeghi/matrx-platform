import type { Metadata } from "next";
import { APP_NAME } from "@matrx/shared";

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

      {/* TODO: Replace with actual form wired to Supabase Auth */}
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Enter your password"
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-dark"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-foreground-secondary">
        Don&apos;t have an account?{" "}
        <a href="/register" className="font-medium text-primary hover:underline">
          Create one
        </a>
      </p>
    </div>
  );
}
