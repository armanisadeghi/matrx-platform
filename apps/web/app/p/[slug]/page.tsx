import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { features } from "@/lib/features";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type PageLayout = "default" | "full_width" | "sidebar" | "blank";

interface DynamicPage {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string;
  custom_css: string | null;
  layout: PageLayout;
  published: boolean;
  meta_image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getDynamicPage(slug: string): Promise<DynamicPage | null> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("dynamic_pages")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !data) {
      return null;
    }

    return data as DynamicPage;
  } catch {
    // Supabase not configured or unreachable
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  if (!features.dynamicPages) {
    return { title: "Not Found" };
  }

  const { slug } = await params;
  const page = await getDynamicPage(slug);

  if (!page) {
    return { title: "Not Found" };
  }

  return {
    title: page.title,
    description: page.description ?? undefined,
    openGraph: {
      title: page.title,
      description: page.description ?? undefined,
      type: "website",
      ...(page.meta_image_url && {
        images: [
          {
            url: page.meta_image_url,
            width: 1200,
            height: 630,
            alt: page.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description ?? undefined,
      ...(page.meta_image_url && {
        images: [page.meta_image_url],
      }),
    },
  };
}

function DefaultLayout({
  page,
  children,
}: {
  page: DynamicPage;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground sm:text-4xl">
          {page.title}
        </h1>
        {children}
      </div>
    </div>
  );
}

function FullWidthLayout({
  page,
  children,
}: {
  page: DynamicPage;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground sm:text-4xl">
          {page.title}
        </h1>
        {children}
      </div>
    </div>
  );
}

function SidebarLayout({
  page,
  children,
}: {
  page: DynamicPage;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Main content */}
          <div>
            <h1 className="mb-8 text-3xl font-bold text-foreground sm:text-4xl">
              {page.title}
            </h1>
            {children}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 rounded-xl border border-border bg-surface p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground-muted">
                About this page
              </h2>
              {page.description && (
                <p className="text-sm leading-relaxed text-foreground-secondary">
                  {page.description}
                </p>
              )}
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs text-foreground-muted">
                  Last updated:{" "}
                  {new Date(page.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function BlankLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}

export default async function DynamicPageRoute({ params }: PageProps) {
  if (!features.dynamicPages) {
    notFound();
  }

  const { slug } = await params;
  const page = await getDynamicPage(slug);

  if (!page) {
    notFound();
  }

  const contentNode = (
    <>
      {/* Custom CSS scoped to this page */}
      {page.custom_css && (
        <style
          dangerouslySetInnerHTML={{
            __html: page.custom_css,
          }}
        />
      )}

      {/* Page content rendered in a sandboxed container */}
      <div
        className="dynamic-page-content prose-matrx text-foreground-secondary [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_h4]:text-foreground [&_strong]:text-foreground"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </>
  );

  switch (page.layout) {
    case "full_width":
      return (
        <FullWidthLayout page={page}>{contentNode}</FullWidthLayout>
      );
    case "sidebar":
      return (
        <SidebarLayout page={page}>{contentNode}</SidebarLayout>
      );
    case "blank":
      return <BlankLayout>{contentNode}</BlankLayout>;
    default:
      return (
        <DefaultLayout page={page}>{contentNode}</DefaultLayout>
      );
  }
}
