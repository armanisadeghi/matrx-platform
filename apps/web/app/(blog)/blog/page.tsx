import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { features } from "@/lib/features";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatDate } from "@matrx/shared";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on AI integration, enterprise workflows, and building modern platforms with Matrx.",
  openGraph: {
    title: "Blog | Matrx",
    description:
      "Insights on AI integration, enterprise workflows, and building modern platforms with Matrx.",
    type: "website",
  },
};

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author_name: string;
  author_avatar_url: string | null;
  published_at: string;
  reading_time_minutes: number;
  tags: string[];
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id, slug, title, excerpt, cover_image_url, author_name, author_avatar_url, published_at, reading_time_minutes, tags"
      )
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch blog posts:", error.message);
      return [];
    }

    return (data as BlogPost[]) ?? [];
  } catch {
    // Supabase not configured or unreachable — return empty
    return [];
  }
}

function BlogComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-on-primary-container"
          aria-hidden="true"
        >
          <path d="M12 20h9" />
          <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-foreground">Blog Coming Soon</h1>
      <p className="mt-3 max-w-md text-foreground-secondary">
        We&apos;re working on great content about AI integrations, enterprise
        workflows, and platform development. Check back soon!
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-on-primary transition-colors hover:bg-primary-dark"
      >
        Back to Home
      </Link>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-background-tertiary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground-muted"
          aria-hidden="true"
        >
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2m0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <path d="M18 14h-8" />
          <path d="M15 18h-5" />
          <path d="M10 6h8v4h-8V6Z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-foreground">No posts yet</h2>
      <p className="mt-2 max-w-md text-foreground-secondary">
        New articles are on the way. Stay tuned for our first post!
      </p>
    </div>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-lg"
    >
      {/* Cover image */}
      {post.cover_image_url ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-background-tertiary">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center bg-background-tertiary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground-muted"
            aria-hidden="true"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary-container px-2.5 py-0.5 text-xs font-medium text-on-primary-container"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-lg font-semibold text-foreground group-hover:text-primary">
          {post.title}
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-foreground-secondary">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="mt-auto flex items-center gap-3 pt-4">
          {post.author_avatar_url ? (
            <Image
              src={post.author_avatar_url}
              alt={post.author_name}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
              {post.author_name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-xs text-foreground-secondary">
            {post.author_name}
          </span>
          <span className="text-foreground-muted">&middot;</span>
          <time
            dateTime={post.published_at}
            className="text-xs text-foreground-muted"
          >
            {formatDate(post.published_at)}
          </time>
          <span className="text-foreground-muted">&middot;</span>
          <span className="text-xs text-foreground-muted">
            {post.reading_time_minutes} min read
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  if (!features.blog) {
    return <BlogComingSoon />;
  }

  const posts = await getBlogPosts();

  if (posts.length === 0) {
    return (
      <>
        <h1 className="mb-8 text-3xl font-bold text-foreground">Blog</h1>
        <EmptyState />
      </>
    );
  }

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">Blog</h1>
        <p className="mt-2 text-foreground-secondary">
          Insights on AI integration, enterprise workflows, and building modern
          platforms.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
