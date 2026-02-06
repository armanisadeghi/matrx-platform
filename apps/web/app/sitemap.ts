import type { MetadataRoute } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { features } from "@/lib/features";

/**
 * Dynamic Sitemap Generator
 *
 * Generates sitemap.xml including:
 * - Static pages (home, login, register, blog index)
 * - Dynamic blog posts from the database
 * - Dynamic pages (CMS-managed pages) from the database
 *
 * Next.js automatically serves this as /sitemap.xml.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://matrx.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Add blog index and dynamic blog posts
  if (features.blog) {
    entries.push({
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    });

    try {
      const supabase = await createServerSupabaseClient();
      const { data: posts } = await supabase
        .from("blog_posts")
        .select("slug, updated_at")
        .eq("published", true)
        .order("updated_at", { ascending: false });

      if (posts) {
        for (const post of posts) {
          entries.push({
            url: `${BASE_URL}/blog/${post.slug}`,
            lastModified: new Date(post.updated_at),
            changeFrequency: "weekly",
            priority: 0.6,
          });
        }
      }
    } catch {
      // Silently continue if blog posts cannot be fetched —
      // static entries are still generated.
    }
  }

  // Add dynamic CMS pages
  if (features.dynamicPages) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: pages } = await supabase
        .from("pages")
        .select("slug, updated_at")
        .eq("published", true)
        .order("updated_at", { ascending: false });

      if (pages) {
        for (const page of pages) {
          entries.push({
            url: `${BASE_URL}/p/${page.slug}`,
            lastModified: new Date(page.updated_at),
            changeFrequency: "weekly",
            priority: 0.5,
          });
        }
      }
    } catch {
      // Silently continue if pages cannot be fetched.
    }
  }

  return entries;
}
