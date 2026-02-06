import Link from "next/link";

/**
 * Blog Layout
 *
 * Clean reading layout with a max-width container and
 * minimal navigation. Used by all routes under (blog)/.
 */
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground-secondary transition-colors hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="text-sm font-medium">Home</span>
          </Link>

          <Link
            href="/blog"
            className="text-lg font-bold text-foreground"
          >
            Matrx Blog
          </Link>

          {/* Spacer to balance the layout */}
          <div className="w-16" />
        </nav>
      </header>

      {/* Main content area */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background-secondary">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-foreground-muted">
            &copy; {new Date().getFullYear()} Matrx. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
