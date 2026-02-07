import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { features } from "@/lib/features";
import type { ApiResponse } from "@matrx/shared";

/**
 * Audit Log API
 *
 * GET /api/audit — Paginated audit log entries (admin only).
 */

export async function GET(request: NextRequest) {
  if (!features.auditLog) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const resource = searchParams.get("resource") ?? undefined;
    const action = searchParams.get("action") ?? undefined;
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const perPage = parseInt(searchParams.get("perPage") ?? "50", 10);

    const supabase = await createServerSupabaseClient();
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from("audit_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (resource) query = query.eq("resource", resource);
    if (action) query = query.eq("action", action);

    const { data, error, count } = await query;

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
    const message = error instanceof Error ? error.message : "Failed to fetch audit logs";
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "INTERNAL_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
