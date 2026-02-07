#!/usr/bin/env tsx
/**
 * Update App Version Script
 *
 * Updates the app_versions table in Supabase with the current build information.
 * Run during the build/deployment process.
 *
 * Usage:
 *   pnpm version:update                    # Auto-increment patch version
 *   pnpm version:update --major            # Increment major version (x.0.0)
 *   pnpm version:update --minor            # Increment minor version (0.x.0)
 *   pnpm version:update --version=2.0.0    # Set specific version
 *
 * Environment variables required:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *
 * Optional:
 *   - DEPLOY_APP_NAME  (default: "web")
 *   - DEPLOY_ENV       (default: "production")
 */

import { createClient } from "@supabase/supabase-js";
import { execSync } from "child_process";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from the web app's .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// Parse command-line arguments
const args = process.argv.slice(2);
const isMajor = args.includes("--major");
const isMinor = args.includes("--minor");
const customVersion = args
  .find((arg) => arg.startsWith("--version="))
  ?.split("=")[1];

// Configurable via env — project-specific values
const APP_NAME = process.env.DEPLOY_APP_NAME ?? "web";
const ENVIRONMENT = process.env.DEPLOY_ENV ?? "production";

// Validate required env vars
if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  console.error("❌ Missing required environment variables:");
  console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ── Git helpers ─────────────────────────────────────────────────────

function getGitCommit(): string | null {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    console.warn("⚠️  Could not get git commit hash");
    return null;
  }
}

function getGitBranch(): string | null {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
  } catch {
    return null;
  }
}

function getCommitMessage(): string | null {
  try {
    return execSync("git log -1 --pretty=%B").toString().trim();
  } catch {
    console.warn("⚠️  Could not get commit message");
    return null;
  }
}

function getCodeStats(): {
  linesAdded: number;
  linesDeleted: number;
  filesChanged: number;
} {
  try {
    const stats = execSync("git diff --numstat HEAD~1 HEAD")
      .toString()
      .trim();
    let linesAdded = 0;
    let linesDeleted = 0;
    let filesChanged = 0;

    if (stats) {
      for (const line of stats.split("\n")) {
        const parts = line.trim().split(/\s+/);
        const added = parts[0];
        const deleted = parts[1];
        if (added && deleted && added !== "-" && deleted !== "-") {
          linesAdded += parseInt(added) || 0;
          linesDeleted += parseInt(deleted) || 0;
          filesChanged += 1;
        }
      }
    }

    return { linesAdded, linesDeleted, filesChanged };
  } catch {
    console.warn("⚠️  Could not get code stats");
    return { linesAdded: 0, linesDeleted: 0, filesChanged: 0 };
  }
}

// ── Version helpers ─────────────────────────────────────────────────

function parseVersion(version: string): [number, number, number] {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match || !match[1] || !match[2] || !match[3]) {
    throw new Error(`Invalid version format: ${version}`);
  }
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

function incrementVersion(
  version: string,
  type: "major" | "minor" | "patch"
): string {
  const [major, minor, patch] = parseVersion(version);
  switch (type) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
  }
}

// ── Main ────────────────────────────────────────────────────────────

async function updateAppVersion() {
  console.log("🔄 Updating app version...\n");

  try {
    // Get current version from database (highest build_number for this app + env)
    const { data: currentData, error: fetchError } = await supabase
      .from("app_versions")
      .select("version, build_number")
      .eq("app_name", APP_NAME)
      .eq("environment", ENVIRONMENT)
      .order("build_number", { ascending: false })
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw new Error(
        `Failed to fetch current version: ${fetchError.message}`
      );
    }

    const currentVersion = currentData?.version ?? "1.0.0";
    const currentBuildNumber = currentData?.build_number ?? 0;

    // Determine new version
    let newVersion: string;
    if (customVersion) {
      parseVersion(customVersion); // validate
      newVersion = customVersion;
      console.log(`📌 Setting custom version: ${newVersion}`);
    } else if (isMajor) {
      newVersion = incrementVersion(currentVersion, "major");
      console.log(
        `⬆️  Major version bump: ${currentVersion} → ${newVersion}`
      );
    } else if (isMinor) {
      newVersion = incrementVersion(currentVersion, "minor");
      console.log(
        `⬆️  Minor version bump: ${currentVersion} → ${newVersion}`
      );
    } else {
      newVersion = incrementVersion(currentVersion, "patch");
      console.log(
        `⬆️  Patch version bump: ${currentVersion} → ${newVersion}`
      );
    }

    const newBuildNumber = currentBuildNumber + 1;
    const gitCommit = getGitCommit();
    const gitBranch = getGitBranch();
    const commitMessage = getCommitMessage();
    const codeStats = getCodeStats();

    // Prevent duplicates: check if this commit already has a version entry
    if (gitCommit) {
      const { data: existing } = await supabase
        .from("app_versions")
        .select("id, version, build_number")
        .eq("git_commit_sha", gitCommit)
        .eq("app_name", APP_NAME)
        .single();

      if (existing) {
        console.log("\n⚠️  Version already exists for this commit!");
        console.log(
          `   Existing: ${existing.version} (build #${existing.build_number})`
        );
        console.log(`   Commit: ${gitCommit}`);
        console.log("\n✅ Skipping duplicate entry\n");
        process.exit(0);
      }
    }

    // Insert new version record
    const { error: insertError } = await supabase
      .from("app_versions")
      .insert({
        app_name: APP_NAME,
        version: newVersion,
        build_number: newBuildNumber,
        git_commit_sha: gitCommit,
        git_branch: gitBranch,
        environment: ENVIRONMENT,
        deployment_provider: "vercel",
        status: "pending",
        changelog: commitMessage,
        is_current: true, // trigger will unset the previous current
        build_metadata: {
          lines_added: codeStats.linesAdded,
          lines_deleted: codeStats.linesDeleted,
          files_changed: codeStats.filesChanged,
        },
        deployed_at: new Date().toISOString(),
      });

    if (insertError) {
      throw new Error(
        `Failed to insert new version: ${insertError.message}`
      );
    }

    console.log("\n✅ App version updated successfully!");
    console.log(`   App:     ${APP_NAME}`);
    console.log(`   Version: ${newVersion}`);
    console.log(`   Build:   #${newBuildNumber}`);
    if (gitCommit) console.log(`   Commit:  ${gitCommit}`);
    if (gitBranch) console.log(`   Branch:  ${gitBranch}`);
    if (commitMessage) console.log(`   Message: ${commitMessage}`);
    if (codeStats.filesChanged > 0) {
      console.log(
        `   Changes: ${codeStats.filesChanged} files, +${codeStats.linesAdded}/-${codeStats.linesDeleted} lines`
      );
    }
    console.log(`   Deployed: ${new Date().toISOString()}\n`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error updating app version:");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

updateAppVersion();
