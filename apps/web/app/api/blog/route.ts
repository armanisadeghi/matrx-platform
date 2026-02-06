import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse, ApiMeta } from "@matrx/shared";
import { paginationSchema } from "@matrx/shared";
import { features } from "@/lib/features";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface BlogPostListItem {
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

/**
 * GET /api/blog
 *
 * List published blog posts with pagination.
 *
 * Query params:
 *   - page (default 1)
 *   - perPage (default 20, max 100)
 *   - sortBy (default "published_at")
 *   - sortOrder (default "desc")
 */
export async function GET(request: NextRequest) {
  if (!features.blog) {
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "FEATURE_DISABLED", message: "Blog feature is not enabled." },
    };
    return NextResponse.json(response, { status: 404 });
  }

  try {
    const { searchParams } = request.nextUrl;

    const parsed = paginationSchema.safeParse({
      page: searchParams.get("page") ?? undefined,
      perPage: searchParams.get("perPage") ?? undefined,
      sortBy: searchParams.get("sortBy") ?? undefined,
      sortOrder: searchParams.get("sortOrder") ?? undefined,
    });

    if (!parsed.success) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid query parameters.",
          details: parsed.error.flatten().fieldErrors as Record<string, unknown>,
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { page, perPage, sortBy, sortOrder } = parsed.data;
    const sortColumn = sortBy ?? "published_at";

    const supabase = await createServerSupabaseClient();

    // Get total count of published posts
    const { count, error: countError } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("published", true);

    if (countError) {
      console.error("Failed to count blog posts:", countError.message);
      const response: ApiResponse<null> = {
        data: null,
        error: { code: "DB_ERROR", message: "Failed to fetch blog posts." },
      };
      return NextResponse.json(response, { status: 500 });
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / perPage);
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    // Fetch paginated posts
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id, slug, title, excerpt, cover_image_url, author_name, author_avatar_url, published_at, reading_time_minutes, tags"
      )
      .eq("published", true)
      .order(sortColumn, { ascending: sortOrder === "asc" })
      .range(from, to);

    if (error) {
      console.error("Failed to fetch blog posts:", error.message);
      const response: ApiResponse<null> = {
        data: null,
        error: { code: "DB_ERROR", message: "Failed to fetch blog posts." },
      };
      return NextResponse.json(response, { status: 500 });
    }

    const meta: ApiMeta = {
      page,
      perPage,
      total,
      totalPages,
    };

    const response: ApiResponse<BlogPostListItem[]> = {
      data: (data as BlogPostListItem[]) ?? [],
      error: null,
      meta,
    };

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Blog list API error:", message);

    const response: ApiResponse<null> = {
      data: null,
      error: { code: "INTERNAL_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
