import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-foreground-secondary">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-on-primary transition-colors hover:bg-primary-dark"
      >
        Go Home
      </Link>
    </main>
  );
}
