import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { features } from "@/lib/features";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatDate } from "@matrx/shared";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author_name: string;
  author_avatar_url: string | null;
  author_bio: string | null;
  published: boolean;
  published_at: string;
  reading_time_minutes: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !data) {
      return null;
    }

    return data as BlogPost;
  } catch {
    // Supabase not configured or unreachable
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt ?? `Read "${post.title}" on the Matrx Blog.`,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? `Read "${post.title}" on the Matrx Blog.`,
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author_name],
      tags: post.tags,
      ...(post.cover_image_url && {
        images: [
          {
            url: post.cover_image_url,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? `Read "${post.title}" on the Matrx Blog.`,
      ...(post.cover_image_url && {
        images: [post.cover_image_url],
      }),
    },
  };
}

/**
 * Render markdown-like content to HTML.
 *
 * This is a lightweight transform that handles the most common
 * markdown patterns. For production use with rich content, swap
 * in a dedicated markdown library (e.g., remark + rehype).
 */
function renderContent(content: string): string {
  let html = content;

  // Escape HTML entities first (prevents XSS)
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headings (### h3, ## h2, # h1)
  html = html.replace(
    /^### (.+)$/gm,
    '<h3 class="mt-8 mb-4 text-lg font-semibold text-foreground">$1</h3>'
  );
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 class="mt-10 mb-4 text-xl font-bold text-foreground">$1</h2>'
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 class="mt-12 mb-6 text-2xl font-bold text-foreground">$1</h1>'
  );

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-background-tertiary px-1.5 py-0.5 font-mono text-sm text-foreground">$1</code>'
  );

  // Code blocks (``` ... ```)
  html = html.replace(
    /```[\w]*\n([\s\S]*?)```/g,
    '<pre class="my-6 overflow-x-auto rounded-lg bg-background-tertiary p-4"><code class="font-mono text-sm text-foreground">$1</code></pre>'
  );

  // Blockquotes
  html = html.replace(
    /^&gt; (.+)$/gm,
    '<blockquote class="my-4 border-l-4 border-primary pl-4 italic text-foreground-secondary">$1</blockquote>'
  );

  // Horizontal rules
  html = html.replace(
    /^---$/gm,
    '<hr class="my-8 border-border" />'
  );

  // Links [text](url)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-primary underline underline-offset-2 hover:text-primary-light" rel="noopener noreferrer">$1</a>'
  );

  // Unordered lists
  html = html.replace(
    /^- (.+)$/gm,
    '<li class="ml-4 list-disc text-foreground-secondary">$1</li>'
  );

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(
    /(<li[^>]*>.*<\/li>\n?)+/g,
    '<ul class="my-4 space-y-1">$&</ul>'
  );

  // Paragraphs: wrap remaining non-empty lines not already wrapped in HTML tags
  html = html.replace(
    /^(?!<[a-z])((?!\s*$).+)$/gm,
    '<p class="my-4 leading-relaxed text-foreground-secondary">$1</p>'
  );

  return html;
}

export default async function BlogPostPage({ params }: PageProps) {
  if (!features.blog) {
    notFound();
  }

  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      {/* Back link */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-foreground-secondary transition-colors hover:text-foreground"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
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
        All posts
      </Link>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary-container px-3 py-1 text-xs font-medium text-on-primary-container"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
        {post.title}
      </h1>

      {/* Meta row */}
      <div className="mt-6 flex items-center gap-4 border-b border-border pb-6">
        {/* Author */}
        <div className="flex items-center gap-3">
          {post.author_avatar_url ? (
            <Image
              src={post.author_avatar_url}
              alt={post.author_name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
              {post.author_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-foreground">
              {post.author_name}
            </p>
            {post.author_bio && (
              <p className="text-xs text-foreground-muted">{post.author_bio}</p>
            )}
          </div>
        </div>

        {/* Date and reading time */}
        <div className="ml-auto flex items-center gap-3 text-sm text-foreground-muted">
          <time dateTime={post.published_at}>
            {formatDate(post.published_at, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>&middot;</span>
          <span>{post.reading_time_minutes} min read</span>
        </div>
      </div>

      {/* Cover image */}
      {post.cover_image_url && (
        <div className="relative my-8 aspect-[2/1] overflow-hidden rounded-xl bg-background-tertiary">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article body */}
      <div
        className="prose-matrx"
        dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
      />

      {/* Post footer */}
      <div className="mt-12 border-t border-border pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {post.author_avatar_url ? (
              <Image
                src={post.author_avatar_url}
                alt={post.author_name}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                {post.author_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-medium text-foreground">{post.author_name}</p>
              {post.author_bio && (
                <p className="text-sm text-foreground-secondary">
                  {post.author_bio}
                </p>
              )}
            </div>
          </div>

          <Link
            href="/blog"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background-secondary"
          >
            More posts
          </Link>
        </div>
      </div>
    </article>
  );
}
