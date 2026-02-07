import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Vercel Deployment Sync Service
 *
 * Fetches actual deployment statuses from the Vercel API and persists them
 * to the `app_versions` table. Only non-terminal records ("pending" or
 * "building") are synced — once a deployment reaches "deployed", "failed",
 * or "canceled" it is never re-checked.
 *
 * Runs automatically when the version API endpoints are hit so data is
 * always consistent regardless of webhook reliability.
 *
 * All project-specific values come from environment variables:
 *   - VERCEL_ACCESS_TOKEN
 *   - VERCEL_PROJECT_ID
 *   - VERCEL_TEAM_ID (optional)
 *   - DEPLOY_APP_NAME (default: "web")
 */

// ── Types ────────────────────────────────────────────────────────────

interface VercelDeployment {
  uid: string;
  url: string;
  state:
    | "BUILDING"
    | "ERROR"
    | "INITIALIZING"
    | "QUEUED"
    | "READY"
    | "CANCELED";
  meta?: {
    githubCommitSha?: string;
  };
}

interface VercelListResponse {
  deployments: VercelDeployment[];
}

type DeploymentStatus =
  | "pending"
  | "building"
  | "deployed"
  | "failed"
  | "canceled";

interface AppVersionRecord {
  id: string;
  git_commit_sha: string | null;
  status: string | null;
}

// ── Helpers ──────────────────────────────────────────────────────────

/** Map a Vercel API state string to our internal status. */
function mapVercelState(
  state: VercelDeployment["state"]
): DeploymentStatus {
  switch (state) {
    case "READY":
      return "deployed";
    case "ERROR":
      return "failed";
    case "CANCELED":
      return "canceled";
    case "BUILDING":
    case "INITIALIZING":
    case "QUEUED":
      return "building";
    default:
      return "pending";
  }
}

/** Returns true when the env vars required for Vercel API calls exist. */
function hasVercelCredentials(): boolean {
  return Boolean(
    process.env.VERCEL_ACCESS_TOKEN && process.env.VERCEL_PROJECT_ID
  );
}

/**
 * Fetch recent deployments from the Vercel API.
 * Returns a Map keyed by the short (7-char) git commit SHA.
 */
async function fetchVercelDeploymentMap(
  limit = 100
): Promise<Map<string, VercelDeployment>> {
  const teamId = process.env.VERCEL_TEAM_ID;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const accessToken = process.env.VERCEL_ACCESS_TOKEN;

  let url = `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=${limit}`;
  if (teamId) url += `&teamId=${teamId}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Vercel API ${response.status}: ${text}`);
  }

  const data: VercelListResponse = await response.json();

  const map = new Map<string, VercelDeployment>();
  for (const deployment of data.deployments) {
    const sha = deployment.meta?.githubCommitSha;
    if (sha) {
      const short = sha.substring(0, 7);
      if (!map.has(short)) {
        map.set(short, deployment);
      }
    }
  }

  return map;
}

// ── Public API ───────────────────────────────────────────────────────

/**
 * Sync all `app_versions` rows that are still in a non-terminal state
 * ("pending" or "building") with the actual Vercel deployment status.
 *
 * Safe to call on every page load: it short-circuits immediately when
 * there are no rows to sync or when Vercel credentials are missing.
 *
 * @returns The number of records that were updated.
 */
export async function syncPendingDeployments(): Promise<number> {
  if (!hasVercelCredentials()) return 0;

  const appName = (process.env.DEPLOY_APP_NAME ?? "web") as
    "web" | "mobile_ios" | "mobile_android";
  const supabase = createAdminClient();

  // 1. Find all records still in a non-terminal state
  const { data: pendingVersions, error: fetchError } = await supabase
    .from("app_versions")
    .select("id, git_commit_sha, status")
    .eq("app_name", appName)
    .in("status", ["pending", "building"])
    .order("build_number", { ascending: false })
    .limit(100);

  if (fetchError) {
    console.error(
      "[vercel-sync] Error fetching pending versions:",
      fetchError
    );
    return 0;
  }

  if (!pendingVersions || pendingVersions.length === 0) return 0;

  // 2. Fetch deployments from Vercel
  let deploymentMap: Map<string, VercelDeployment>;
  try {
    deploymentMap = await fetchVercelDeploymentMap();
  } catch (err) {
    console.error(
      "[vercel-sync] Error fetching from Vercel:",
      err
    );
    return 0;
  }

  // 3. Update each record whose Vercel status differs
  let updated = 0;

  for (const version of pendingVersions as AppVersionRecord[]) {
    if (!version.git_commit_sha) continue;

    const deployment = deploymentMap.get(version.git_commit_sha);
    if (!deployment) continue;

    const newStatus = mapVercelState(deployment.state);
    if (newStatus === version.status) continue;

    const { error: updateError } = await supabase
      .from("app_versions")
      .update({
        status: newStatus as "pending" | "building" | "deployed" | "failed" | "canceled",
        deployment_id: deployment.uid,
        deployment_url: `https://${deployment.url}`,
      })
      .eq("id", version.id);

    if (updateError) {
      console.error(
        `[vercel-sync] Failed to update ${version.id}:`,
        updateError
      );
    } else {
      updated++;
    }
  }

  if (updated > 0) {
    console.log(
      `[vercel-sync] Updated ${updated} deployment statuses`
    );
  }

  return updated;
}
