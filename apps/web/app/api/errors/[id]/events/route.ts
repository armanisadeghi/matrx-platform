import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { features } from "@/lib/features";
import type { ApiResponse } from "@matrx/shared";

/**
 * Error Events API
 *
 * GET /api/errors/:id/events — Paginated list of events for an error group.
 */

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  if (!features.errorTracking) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const { id } = await context.params;
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const perPage = parseInt(searchParams.get("perPage") ?? "20", 10);

    const supabase = await createServerSupabaseClient();
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, error, count } = await supabase
      .from("error_events")
      .select("*", { count: "exact" })
      .eq("group_id", id)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: { code: "DB_ERROR", message: error.message },
      };
      return NextResponse.json(response, { status: 500 });
    }

    const response: ApiResponse<typeof data> = {
      data,
      error: null,
      meta: {
        page,
        perPage,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / perPage),
      },
    };
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch error events";
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "INTERNAL_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
