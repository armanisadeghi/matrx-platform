import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncPendingDeployments } from "@/lib/services/vercel-sync";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/version
 *
 * Returns the current deployed version of the app.
 * Used by clients to check if they need to refresh.
 *
 * Before returning, syncs any pending/building records with Vercel
 * so the reported status is always accurate.
 *
 * Reads DEPLOY_APP_NAME from env (defaults to "web").
 */
export async function GET() {
  try {
    await syncPendingDeployments();

    const appName = (process.env.DEPLOY_APP_NAME ?? "web") as
      "web" | "mobile_ios" | "mobile_android";
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("app_versions")
      .select(
        "version, build_number, git_commit_sha, git_branch, changelog, deployed_at, status, deployment_url, build_metadata"
      )
      .eq("app_name", appName)
      .eq("environment", "production")
      .order("build_number", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching app version:", error);
      return NextResponse.json(
        { error: "Failed to fetch version" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "No version found" },
        { status: 404 }
      );
    }

    const metadata = (data.build_metadata ?? {}) as Record<
      string,
      unknown
    >;

    return NextResponse.json({
      version: data.version,
      buildNumber: data.build_number,
      gitCommit: data.git_commit_sha,
      gitBranch: data.git_branch,
      commitMessage: data.changelog,
      linesAdded: metadata.lines_added ?? null,
      linesDeleted: metadata.lines_deleted ?? null,
      filesChanged: metadata.files_changed ?? null,
      deployedAt: data.deployed_at,
      deploymentStatus: data.status,
      deploymentUrl: data.deployment_url,
    });
  } catch (error) {
    console.error("Error in version endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
