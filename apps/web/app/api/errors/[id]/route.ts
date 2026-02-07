import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { features } from "@/lib/features";
import type { ApiResponse } from "@matrx/shared";

/**
 * Error Group Detail API
 *
 * GET    /api/errors/:id — Get error group details
 * PATCH  /api/errors/:id — Update status (resolve, ignore, mute) or assign
 * DELETE /api/errors/:id — Delete error group and all its events
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
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("error_groups")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      const response: ApiResponse<null> = {
        data: null,
        error: { code: "NOT_FOUND", message: "Error group not found" },
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<typeof data> = { data, error: null };
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch error group";
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "INTERNAL_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!features.errorTracking) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const supabase = await createServerSupabaseClient();

    const update: Record<string, unknown> = {};

    if (body.status && typeof body.status === "string") {
      update.status = body.status;
      if (body.status === "resolved") {
        update.resolved_at = new Date().toISOString();
      } else {
        update.resolved_at = null;
        update.resolved_by = null;
      }
    }

    if (body.assignedTo !== undefined) {
      update.assigned_to = body.assignedTo;
    }

    const { data, error } = await supabase
      .from("error_groups")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: { code: "DB_ERROR", message: error.message },
      };
      return NextResponse.json(response, { status: 500 });
    }

    // Audit the action
    if (features.auditLog) {
      await supabase.from("audit_logs").insert({
        action: `error.${body.status ?? "update"}`,
        resource: "error_groups",
        resource_id: id,
        changes: update,
        user_agent: request.headers.get("user-agent"),
        ip_address: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      });
    }

    const response: ApiResponse<typeof data> = { data, error: null };
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update error group";
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "INTERNAL_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!features.errorTracking) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const { id } = await context.params;
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("error_groups")
      .delete()
      .eq("id", id);

    if (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: { code: "DB_ERROR", message: error.message },
      };
      return NextResponse.json(response, { status: 500 });
    }

    // Audit the deletion
    if (features.auditLog) {
      await supabase.from("audit_logs").insert({
        action: "error.delete",
        resource: "error_groups",
        resource_id: id,
        user_agent: request.headers.get("user-agent"),
        ip_address: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      });
    }

    return NextResponse.json({ data: { deleted: true }, error: null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete error group";
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "INTERNAL_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
