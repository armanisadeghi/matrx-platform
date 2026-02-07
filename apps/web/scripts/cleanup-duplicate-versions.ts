#!/usr/bin/env tsx
/**
 * Cleanup Duplicate Versions Script
 *
 * Removes duplicate app_versions entries. For each git_commit_sha with
 * multiple entries, keeps the entry with the HIGHER build number.
 *
 * Usage:
 *   pnpm cleanup:duplicates
 *
 * Environment variables required:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *
 * Optional:
 *   - DEPLOY_APP_NAME (default: "web")
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const APP_NAME = process.env.DEPLOY_APP_NAME ?? "web";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
  console.error("❌ Missing required environment variables:");
  console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function cleanupDuplicates() {
  console.log("🔍 Scanning for duplicate version entries...\n");

  try {
    const { data: allRecords, error: fetchError } = await supabase
      .from("app_versions")
      .select("git_commit_sha")
      .eq("app_name", APP_NAME)
      .not("git_commit_sha", "is", null);

    if (fetchError) {
      throw new Error(
        `Failed to fetch versions: ${fetchError.message}`
      );
    }

    if (!allRecords || allRecords.length === 0) {
      console.log("✅ No versions found in database\n");
      return;
    }

    // Count occurrences of each commit
    const commitCounts = new Map<string, number>();
    allRecords.forEach((record) => {
      if (record.git_commit_sha) {
        commitCounts.set(
          record.git_commit_sha,
          (commitCounts.get(record.git_commit_sha) || 0) + 1
        );
      }
    });

    const duplicateCommitHashes = Array.from(commitCounts.entries())
      .filter(([, count]) => count > 1)
      .map(([hash]) => hash);

    if (duplicateCommitHashes.length === 0) {
      console.log(
        "✅ No duplicate entries found! Database is clean.\n"
      );
      return;
    }

    console.log(
      `Found ${duplicateCommitHashes.length} commits with duplicate entries:\n`
    );

    let totalDeleted = 0;
    let totalKept = 0;

    for (const gitCommit of duplicateCommitHashes) {
      const { data: versions, error: versionsError } = await supabase
        .from("app_versions")
        .select(
          "id, version, build_number, git_commit_sha, deployed_at"
        )
        .eq("git_commit_sha", gitCommit)
        .eq("app_name", APP_NAME)
        .order("build_number", { ascending: false });

      if (versionsError || !versions || versions.length === 0) {
        console.warn(
          `⚠️  Could not fetch versions for commit ${gitCommit}`
        );
        continue;
      }

      const toKeep = versions[0]!;
      const toDelete = versions.slice(1);

      console.log(`Commit ${gitCommit}:`);
      console.log(
        `  ✓ Keeping: v${toKeep.version} (build #${toKeep.build_number})`
      );

      for (const version of toDelete) {
        console.log(
          `  ✗ Deleting: v${version.version} (build #${version.build_number})`
        );

        const { error: deleteError } = await supabase
          .from("app_versions")
          .delete()
          .eq("id", version.id);

        if (deleteError) {
          console.error(
            `    Error deleting ${version.id}:`,
            deleteError.message
          );
        } else {
          totalDeleted++;
        }
      }

      totalKept++;
      console.log();
    }

    console.log("\n✅ Cleanup complete!");
    console.log(
      `   Commits processed: ${duplicateCommitHashes.length}`
    );
    console.log(`   Entries kept: ${totalKept}`);
    console.log(`   Entries deleted: ${totalDeleted}`);
    console.log();

    const { count: finalCount } = await supabase
      .from("app_versions")
      .select("*", { count: "exact", head: true })
      .eq("app_name", APP_NAME);

    console.log(
      `📊 Total ${APP_NAME} versions remaining: ${finalCount || 0}\n`
    );

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error during cleanup:");
    console.error(
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

cleanupDuplicates();
