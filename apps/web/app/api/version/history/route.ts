import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncPendingDeployments } from "@/lib/services/vercel-sync";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/version/history?limit=20&offset=0
 *
 * Returns paginated version history from the app_versions table.
 * Syncs pending/building records with Vercel before returning.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Limit must be between 1 and 100" },
        { status: 400 }
      );
    }

    if (offset < 0) {
      return NextResponse.json(
        { error: "Offset must be non-negative" },
        { status: 400 }
      );
    }

    await syncPendingDeployments();

    const appName = (process.env.DEPLOY_APP_NAME ?? "web") as
      "web" | "mobile_ios" | "mobile_android";
    const supabase = createAdminClient();

    // Total count
    const { count: totalCount, error: countError } = await supabase
      .from("app_versions")
      .select("*", { count: "exact", head: true })
      .eq("app_name", appName)
      .eq("environment", "production");

    if (countError) {
      console.error("Error counting versions:", countError);
      return NextResponse.json(
        { error: "Failed to count versions" },
        { status: 500 }
      );
    }

    // Paginated results
    const { data, error } = await supabase
      .from("app_versions")
      .select(
        "id, version, build_number, git_commit_sha, git_branch, changelog, deployed_at, created_at, status, deployment_id, deployment_url, build_metadata"
      )
      .eq("app_name", appName)
      .eq("environment", "production")
      .order("build_number", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching version history:", error);
      return NextResponse.json(
        { error: "Failed to fetch version history" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      versions: data ?? [],
      total: totalCount ?? 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error in version history endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
