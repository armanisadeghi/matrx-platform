import type { Metadata } from "next";
import { features } from "@/lib/features";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pages",
};

/** Placeholder page data for when Supabase is not configured. */
const PLACEHOLDER_PAGES = [
  {
    id: "1",
    title: "About Us",
    slug: "about",
    status: "published",
    type: "static",
    version: 3,
    updated_at: "2026-01-28T10:00:00Z",
  },
  {
    id: "2",
    title: "Privacy Policy",
    slug: "privacy",
    status: "published",
    type: "legal",
    version: 2,
    updated_at: "2026-01-15T14:30:00Z",
  },
  {
    id: "3",
    title: "Terms of Service",
    slug: "terms",
    status: "published",
    type: "legal",
    version: 4,
    updated_at: "2026-02-01T09:15:00Z",
  },
  {
    id: "4",
    title: "Pricing",
    slug: "pricing",
    status: "draft",
    type: "marketing",
    version: 1,
    updated_at: "2026-02-04T16:45:00Z",
  },
  {
    id: "5",
    title: "Contact",
    slug: "contact",
    status: "published",
    type: "static",
    version: 1,
    updated_at: "2025-12-20T11:00:00Z",
  },
  {
    id: "6",
    title: "Careers",
    slug: "careers",
    status: "draft",
    type: "marketing",
    version: 1,
    updated_at: "2026-02-05T08:30:00Z",
  },
];

interface PageRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  type: string;
  version: number;
  updated_at: string;
}

/**
 * Fetch dynamic pages from Supabase, or return placeholder data.
 */
async function getPages(): Promise<PageRow[]> {
  if (!features.dynamicPages) {
    return PLACEHOLDER_PAGES;
  }

  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("pages")
      .select("id, title, slug, status, type, version, updated_at")
      .order("updated_at", { ascending: false })
      .limit(50);

    if (error || !data) {
      return PLACEHOLDER_PAGES;
    }

    return data as PageRow[];
  } catch {
    return PLACEHOLDER_PAGES;
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-success-light text-success",
    draft: "bg-warning-light text-warning",
    archived: "bg-background-tertiary text-foreground-muted",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? "bg-background-secondary text-foreground-secondary"}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    static: "bg-background-secondary text-foreground-secondary",
    legal: "bg-info-light text-info",
    marketing: "bg-primary-container text-on-primary-container",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[type] ?? "bg-background-secondary text-foreground-secondary"}`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

/**
 * Pages Management Page
 *
 * Server Component showing all dynamic pages with their metadata.
 */
export default async function PagesPage() {
  const pages = await getPages();
  const isPlaceholder = !features.dynamicPages;

  return (
    <div className="flex flex-col gap-6">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pages</h1>
          <p className="mt-1 text-foreground-secondary">
            Manage dynamic pages and content.
          </p>
        </div>
        <a
          href="/admin/pages/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-dark"
        >
          New Page
        </a>
      </div>

      {/* Placeholder notice */}
      {isPlaceholder && (
        <div className="rounded-lg border border-border bg-warning-light px-4 py-3">
          <p className="text-sm font-medium text-warning">
            Dynamic pages feature is disabled. Showing placeholder data.
          </p>
          <p className="mt-1 text-xs text-foreground-secondary">
            Enable the dynamicPages feature flag and configure Supabase to manage
            real pages.
          </p>
        </div>
      )}

      {/* Pages table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background-secondary">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Type
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pages.map((page) => (
                <tr
                  key={page.id}
                  className="transition-colors hover:bg-background-secondary"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                    {page.title}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <code className="rounded bg-background-tertiary px-1.5 py-0.5 font-mono text-xs text-foreground-secondary">
                      /p/{page.slug}
                    </code>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={page.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <TypeBadge type={page.type} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-foreground-secondary">
                    v{page.version}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground-secondary">
                    {formatDate(page.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-foreground-muted">No pages found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
