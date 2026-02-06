import { APP_NAME, APP_DESCRIPTION } from "@matrx/shared";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          {APP_NAME}
        </h1>
        <p className="max-w-lg text-lg text-foreground-secondary">
          {APP_DESCRIPTION}
        </p>
      </div>
      <div className="flex gap-4">
        <a
          href="/login"
          className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-on-primary transition-colors hover:bg-primary-dark"
        >
          Sign In
        </a>
        <a
          href="/register"
          className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background-secondary"
        >
          Get Started
        </a>
      </div>
    </main>
  );
}
