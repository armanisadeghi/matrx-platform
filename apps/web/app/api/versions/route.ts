import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { features } from "@/lib/features";
import { PAGINATION } from "@matrx/shared";
import type { ApiResponse, ApiMeta } from "@matrx/shared";

/**
 * App Versions API
 *
 * GET  — List app versions, filterable by app_name and environment.
 * POST — Create a new version record (admin only).
 */

interface AppVersion {
  id: string;
  app_name: string;
  version: string;
  environment: string;
  source: string;
  status: string;
  commit_sha: string | null;
  commit_message: string | null;
  author: string | null;
  deployed_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export async function GET(request: NextRequest) {
  if (!features.versionTracking) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const appName = searchParams.get("app_name");
    const environment = searchParams.get("environment");
    const page = Math.max(1, Number(searchParams.get("page")) || PAGINATION.DEFAULT_PAGE);
    const perPage = Math.min(
      PAGINATION.MAX_PER_PAGE,
      Math.max(1, Number(searchParams.get("per_page")) || PAGINATION.DEFAULT_PER_PAGE)
    );

    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("app_versions")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (appName) {
      query = query.eq("app_name", appName);
    }

    if (environment) {
      query = query.eq("environment", environment);
    }

    const { data, count, error } = await query;

    if (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "DB_ERROR",
          message: `Failed to fetch versions: ${error.message}`,
        },
      };
      return NextResponse.json(response, { status: 500 });
    }

    const total = count ?? 0;
    const meta: ApiMeta = {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    };

    const response: ApiResponse<AppVersion[]> = {
      data: data as AppVersion[],
      error: null,
      meta,
    };
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to list versions";
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "INTERNAL_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!features.versionTracking) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const supabase = await createServerSupabaseClient();

    // Verify the user is authenticated and has admin role
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "FORBIDDEN",
          message: "Admin access required to create version records",
        },
      };
      return NextResponse.json(response, { status: 403 });
    }

    const body = (await request.json()) as Record<string, unknown>;

    // Validate required fields
    const appName = body.app_name as string | undefined;
    const version = body.version as string | undefined;

    if (!appName || !version) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: "app_name and version are required",
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { data, error: insertError } = await supabase
      .from("app_versions")
      .insert({
        app_name: appName,
        version,
        environment: (body.environment as string) ?? "production",
        source: (body.source as string) ?? "manual",
        status: (body.status as string) ?? "pending",
        commit_sha: (body.commit_sha as string) ?? null,
        commit_message: (body.commit_message as string) ?? null,
        author: (body.author as string) ?? user.email ?? "unknown",
        metadata: (body.metadata as Record<string, unknown>) ?? null,
      })
      .select()
      .single();

    if (insertError) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "DB_ERROR",
          message: `Failed to create version: ${insertError.message}`,
        },
      };
      return NextResponse.json(response, { status: 500 });
    }

    const response: ApiResponse<AppVersion> = {
      data: data as AppVersion,
      error: null,
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create version";
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "INTERNAL_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
