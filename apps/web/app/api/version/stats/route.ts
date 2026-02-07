import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PeriodStats {
  deployments: number;
  linesAdded: number;
  linesDeleted: number;
  filesChanged: number;
}

interface DeploymentStats {
  today: PeriodStats;
  week: PeriodStats;
  month: PeriodStats;
  averageTimeBetweenDeployments: string;
  totalDeployments: number;
}

/**
 * GET /api/version/stats
 *
 * Returns deployment statistics for last 24 hours, week, and month.
 */
export async function GET() {
  try {
    const appName = (process.env.DEPLOY_APP_NAME ?? "web") as
      "web" | "mobile_ios" | "mobile_android";
    const supabase = createAdminClient();
    const now = new Date();

    const twentyFourHoursAgo = new Date(
      now.getTime() - 24 * 60 * 60 * 1000
    ).toISOString();
    const oneWeekAgo = new Date(
      now.getTime() - 7 * 24 * 60 * 60 * 1000
    ).toISOString();
    const oneMonthAgo = new Date(
      now.getTime() - 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    // Get all monthly deployments (to compute all stats)
    const { data: monthlyDeployments, error: monthlyError } =
      await supabase
        .from("app_versions")
        .select("id, deployed_at, build_metadata")
        .eq("app_name", appName)
        .eq("environment", "production")
        .gte("deployed_at", oneMonthAgo)
        .order("deployed_at", { ascending: false });

    if (monthlyError) {
      console.error(
        "Error fetching monthly deployments:",
        monthlyError
      );
      return NextResponse.json(
        { error: "Failed to fetch deployment stats" },
        { status: 500 }
      );
    }

    // Total count
    const { count: totalCount, error: countError } = await supabase
      .from("app_versions")
      .select("*", { count: "exact", head: true })
      .eq("app_name", appName)
      .eq("environment", "production");

    if (countError) {
      console.error("Error counting deployments:", countError);
    }

    // Filter for time periods
    const todayDeployments =
      monthlyDeployments?.filter(
        (d) =>
          new Date(d.deployed_at) >=
          new Date(twentyFourHoursAgo)
      ) ?? [];

    const weekDeployments =
      monthlyDeployments?.filter(
        (d) =>
          new Date(d.deployed_at) >= new Date(oneWeekAgo)
      ) ?? [];

    const monthDeploymentsFiltered = monthlyDeployments ?? [];

    // Aggregate stats for a set of deployments
    function aggregateStats(
      deployments: typeof monthlyDeployments
    ): PeriodStats {
      if (!deployments || deployments.length === 0) {
        return {
          deployments: 0,
          linesAdded: 0,
          linesDeleted: 0,
          filesChanged: 0,
        };
      }

      return {
        deployments: deployments.length,
        linesAdded: deployments.reduce((sum, d) => {
          const m = (d.build_metadata ?? {}) as Record<
            string,
            number
          >;
          return sum + (m.lines_added ?? 0);
        }, 0),
        linesDeleted: deployments.reduce((sum, d) => {
          const m = (d.build_metadata ?? {}) as Record<
            string,
            number
          >;
          return sum + (m.lines_deleted ?? 0);
        }, 0),
        filesChanged: deployments.reduce((sum, d) => {
          const m = (d.build_metadata ?? {}) as Record<
            string,
            number
          >;
          return sum + (m.files_changed ?? 0);
        }, 0),
      };
    }

    // Average time between deployments (using week data)
    let averageTimeBetweenDeployments = "N/A";
    if (weekDeployments.length > 1) {
      const times = weekDeployments
        .map((d) => new Date(d.deployed_at).getTime())
        .sort((a, b) => b - a);

      let totalDiff = 0;
      for (let i = 0; i < times.length - 1; i++) {
        totalDiff += (times[i] ?? 0) - (times[i + 1] ?? 0);
      }

      const avgDiffMs = totalDiff / (times.length - 1);
      const avgDiffMinutes = avgDiffMs / (1000 * 60);
      const avgDiffHours = avgDiffMs / (1000 * 60 * 60);

      if (avgDiffMinutes < 60) {
        averageTimeBetweenDeployments = `${Math.round(avgDiffMinutes)}m`;
      } else if (avgDiffHours < 24) {
        averageTimeBetweenDeployments = `${Math.round(avgDiffHours)}h`;
      } else {
        averageTimeBetweenDeployments = `${Math.round(avgDiffHours / 24)}d`;
      }
    }

    const stats: DeploymentStats = {
      today: aggregateStats(todayDeployments),
      week: aggregateStats(weekDeployments),
      month: aggregateStats(monthDeploymentsFiltered),
      averageTimeBetweenDeployments,
      totalDeployments: totalCount ?? 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error in version stats endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
