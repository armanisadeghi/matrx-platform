#!/usr/bin/env tsx
/**
 * Sync Vercel Deployment Status Script
 *
 * Fetches deployment status from Vercel API and updates
 * the app_versions table to match actual deployment status.
 *
 * Usage:
 *   pnpm vercel:sync              # Sync all pending deployments
 *   pnpm vercel:sync --all        # Sync all deployments (last 100)
 *
 * Environment variables required:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - VERCEL_ACCESS_TOKEN  (create at https://vercel.com/account/tokens)
 *   - VERCEL_PROJECT_ID    (your project ID from Vercel settings)
 *
 * Optional:
 *   - VERCEL_TEAM_ID       (for team projects)
 *   - DEPLOY_APP_NAME      (default: "web")
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const args = process.argv.slice(2);
const syncAll = args.includes("--all");
const APP_NAME = process.env.DEPLOY_APP_NAME ?? "web";

// Validate env vars
const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "VERCEL_ACCESS_TOKEN",
  "VERCEL_PROJECT_ID",
];

const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingVars.forEach((v) => console.error(`   - ${v}`));
  console.error("\nTo set up VERCEL_ACCESS_TOKEN:");
  console.error("   1. Go to https://vercel.com/account/tokens");
  console.error("   2. Create a new token with appropriate scope");
  console.error("   3. Add it to your .env.local file");
  console.error("\nTo find VERCEL_PROJECT_ID:");
  console.error(
    "   1. Go to your project settings in Vercel"
  );
  console.error("   2. Find the Project ID in General settings");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

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
  meta?: { githubCommitSha?: string };
}

interface VercelResponse {
  deployments: VercelDeployment[];
}

async function fetchVercelDeployments(
  limit = 100
): Promise<VercelDeployment[]> {
  const teamId = process.env.VERCEL_TEAM_ID;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const accessToken = process.env.VERCEL_ACCESS_TOKEN;

  let url = `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=${limit}`;
  if (teamId) url += `&teamId=${teamId}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vercel API error: ${response.status} - ${error}`);
  }

  const data: VercelResponse = await response.json();
  return data.deployments;
}

function mapVercelState(
  state: VercelDeployment["state"]
): string {
  switch (state) {
    case "READY":
      return "deployed";
    case "ERROR":
      return "failed";
    case "BUILDING":
    case "INITIALIZING":
    case "QUEUED":
      return "building";
    case "CANCELED":
      return "canceled";
    default:
      return "pending";
  }
}

async function syncDeployments() {
  console.log("🔄 Syncing Vercel deployment status...\n");

  try {
    console.log("📡 Fetching deployments from Vercel...");
    const vercelDeployments = await fetchVercelDeployments(
      syncAll ? 100 : 50
    );
    console.log(
      `   Found ${vercelDeployments.length} deployments\n`
    );

    // Map git commit (short) → deployment
    const deploymentMap = new Map<string, VercelDeployment>();
    for (const deployment of vercelDeployments) {
      const commitSha = deployment.meta?.githubCommitSha;
      if (commitSha) {
        const shortSha = commitSha.substring(0, 7);
        if (!deploymentMap.has(shortSha)) {
          deploymentMap.set(shortSha, deployment);
        }
      }
    }

    // Get app versions from database
    console.log("📊 Fetching app versions from database...");
    const query = supabase
      .from("app_versions")
      .select(
        "id, version, build_number, git_commit_sha, status, deployment_id"
      )
      .eq("app_name", APP_NAME)
      .order("build_number", { ascending: false });

    if (!syncAll) {
      query.in("status", ["pending", "building"]);
    }

    const { data: versions, error } = await query.limit(100);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (!versions || versions.length === 0) {
      console.log("   No versions to sync\n");
      console.log("✅ Sync complete!\n");
      return;
    }

    console.log(`   Found ${versions.length} versions to check\n`);

    let updated = 0;
    let skipped = 0;
    let notFound = 0;

    for (const version of versions) {
      const shortCommit = version.git_commit_sha;
      if (!shortCommit) {
        skipped++;
        continue;
      }

      const deployment = deploymentMap.get(shortCommit);
      if (!deployment) {
        notFound++;
        continue;
      }

      const newStatus = mapVercelState(deployment.state);

      if (
        version.status === newStatus &&
        version.status !== "pending"
      ) {
        skipped++;
        continue;
      }

      const { error: updateError } = await supabase
        .from("app_versions")
        .update({
          status: newStatus,
          deployment_id: deployment.uid,
          deployment_url: `https://${deployment.url}`,
        })
        .eq("id", version.id);

      if (updateError) {
        console.error(
          `   ❌ Failed to update v${version.version}: ${updateError.message}`
        );
      } else {
        console.log(
          `   ✓ v${version.version} (#${version.build_number}): ${version.status} → ${newStatus}`
        );
        updated++;
      }
    }

    console.log("\n📈 Sync Summary:");
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped (no change): ${skipped}`);
    console.log(`   Not found in Vercel: ${notFound}`);
    console.log("\n✅ Sync complete!\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error syncing deployments:");
    console.error(
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

syncDeployments();
