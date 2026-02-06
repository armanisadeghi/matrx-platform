import type { Metadata } from "next";
import { features } from "@/lib/features";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Blog Posts",
};

/** Placeholder blog post data for when Supabase is not configured. */
const PLACEHOLDER_POSTS = [
  {
    id: "1",
    title: "Getting Started with Matrx AI",
    author: "Alice Johnson",
    status: "published",
    published_at: "2026-01-15T10:00:00Z",
    views: 1243,
  },
  {
    id: "2",
    title: "Building Custom Integrations",
    author: "Bob Smith",
    status: "published",
    published_at: "2026-01-22T14:30:00Z",
    views: 876,
  },
  {
    id: "3",
    title: "Advanced Workflow Automation",
    author: "Alice Johnson",
    status: "draft",
    published_at: null,
    views: 0,
  },
  {
    id: "4",
    title: "Security Best Practices for Enterprise",
    author: "Carol Davis",
    status: "published",
    published_at: "2026-02-01T09:15:00Z",
    views: 432,
  },
  {
    id: "5",
    title: "API Reference Guide v2",
    author: "Dan Wilson",
    status: "draft",
    published_at: null,
    views: 0,
  },
  {
    id: "6",
    title: "Deprecation Notice: Legacy Endpoints",
    author: "Alice Johnson",
    status: "archived",
    published_at: "2025-10-05T16:00:00Z",
    views: 2104,
  },
];

interface BlogPostRow {
  id: string;
  title: string;
  author: string;
  status: string;
  published_at: string | null;
  views: number;
}

/**
 * Fetch blog posts from Supabase, or return placeholder data.
 */
async function getBlogPosts(
  statusFilter?: string
): Promise<BlogPostRow[]> {
  if (!features.blog) {
    return PLACEHOLDER_POSTS;
  }

  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("blog_posts")
      .select("id, title, author, status, published_at, views")
      .order("created_at", { ascending: false })
      .limit(50);

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;

    if (error || !data) {
      return PLACEHOLDER_POSTS;
    }

    return data as BlogPostRow[];
  } catch {
    return PLACEHOLDER_POSTS;
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatViews(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
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

/**
 * Blog Posts Management Page
 *
 * Server Component with data table, status filtering, and new post action.
 */
export default async function BlogPostsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const statusFilter =
    typeof params.status === "string" ? params.status : "all";
  const posts = await getBlogPosts(statusFilter);
  const isPlaceholder = !features.blog;

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Drafts" },
    { value: "archived", label: "Archived" },
  ];

  // Apply client-side filter for placeholder data
  const filteredPosts =
    isPlaceholder && statusFilter !== "all"
      ? posts.filter((p) => p.status === statusFilter)
      : posts;

  return (
    <div className="flex flex-col gap-6">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
          <p className="mt-1 text-foreground-secondary">
            Create and manage blog content.
          </p>
        </div>
        <a
          href="/admin/blog/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-dark"
        >
          New Post
        </a>
      </div>

      {/* Placeholder notice */}
      {isPlaceholder && (
        <div className="rounded-lg border border-border bg-warning-light px-4 py-3">
          <p className="text-sm font-medium text-warning">
            Blog feature is disabled. Showing placeholder data.
          </p>
          <p className="mt-1 text-xs text-foreground-secondary">
            Enable the blog feature flag and configure Supabase to manage real posts.
          </p>
        </div>
      )}

      {/* Status filter */}
      <div className="flex items-center gap-2">
        {statusOptions.map((option) => (
          <a
            key={option.value}
            href={
              option.value === "all"
                ? "/admin/blog"
                : `/admin/blog?status=${option.value}`
            }
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === option.value
                ? "bg-primary text-on-primary"
                : "bg-background-secondary text-foreground-secondary hover:text-foreground"
            }`}
          >
            {option.label}
          </a>
        ))}
      </div>

      {/* Blog posts table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background-secondary">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Published
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Views
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  className="transition-colors hover:bg-background-secondary"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                    {post.title}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground-secondary">
                    {post.author}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground-secondary">
                    {formatDate(post.published_at)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-foreground-secondary">
                    {formatViews(post.views)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-foreground-muted">
              No blog posts found
              {statusFilter !== "all" ? ` with status "${statusFilter}"` : ""}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
