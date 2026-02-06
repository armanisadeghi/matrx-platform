import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@matrx/shared";
import { features } from "@/lib/features";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/blog/[slug]
 *
 * Fetch a single published blog post by its slug.
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  if (!features.blog) {
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "FEATURE_DISABLED", message: "Blog feature is not enabled." },
    };
    return NextResponse.json(response, { status: 404 });
  }

  try {
    const { slug } = await context.params;
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !data) {
      const response: ApiResponse<null> = {
        data: null,
        error: { code: "NOT_FOUND", message: `Blog post "${slug}" not found.` },
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<BlogPost> = {
      data: data as BlogPost,
      error: null,
    };

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Blog detail GET error:", message);

    const response: ApiResponse<null> = {
      data: null,
      error: { code: "INTERNAL_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * PATCH /api/blog/[slug]
 *
 * Update a blog post. Admin-only endpoint.
 * Requires authenticated session with admin role.
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!features.blog) {
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "FEATURE_DISABLED", message: "Blog feature is not enabled." },
    };
    return NextResponse.json(response, { status: 404 });
  }

  try {
    const { slug } = await context.params;
    const supabase = await createServerSupabaseClient();

    // Verify the user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      const response: ApiResponse<null> = {
        data: null,
        error: { code: "UNAUTHORIZED", message: "Authentication required." },
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Verify admin role via user metadata or profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "FORBIDDEN",
          message: "Admin access required to update blog posts.",
        },
      };
      return NextResponse.json(response, { status: 403 });
    }

    // Parse and validate update payload
    const body = await request.json();

    // Only allow updating specific fields
    const allowedFields = [
      "title",
      "excerpt",
      "content",
      "cover_image_url",
      "author_name",
      "author_avatar_url",
      "author_bio",
      "published",
      "published_at",
      "reading_time_minutes",
      "tags",
    ] as const;

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: "No valid fields to update.",
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Add updated_at timestamp
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("blog_posts")
      .update(updates)
      .eq("slug", slug)
      .select("*")
      .single();

    if (error) {
      console.error("Failed to update blog post:", error.message);
      const response: ApiResponse<null> = {
        data: null,
        error: { code: "DB_ERROR", message: "Failed to update blog post." },
      };
      return NextResponse.json(response, { status: 500 });
    }

    if (!data) {
      const response: ApiResponse<null> = {
        data: null,
        error: { code: "NOT_FOUND", message: `Blog post "${slug}" not found.` },
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<BlogPost> = {
      data: data as BlogPost,
      error: null,
    };

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Blog detail PATCH error:", message);

    const response: ApiResponse<null> = {
      data: null,
      error: { code: "INTERNAL_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
