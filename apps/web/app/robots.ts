import type { MetadataRoute } from "next";

/**
 * Robots.txt Configuration
 *
 * - Allows all crawlers for public pages
 * - Disallows /admin, /api, and /dashboard (private routes)
 * - Points crawlers to the auto-generated sitemap
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://matrx.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/dashboard"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
