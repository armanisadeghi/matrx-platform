import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { features } from "@/lib/features";
import type { ApiResponse } from "@matrx/shared";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * POST /api/webhooks/vercel
 *
 * Receives Vercel deployment webhooks and updates the app_versions table.
 *
 * Webhook events handled:
 *   - deployment.created   → status: "building"
 *   - deployment.succeeded → status: "deployed"
 *   - deployment.error     → status: "failed"
 *   - deployment.canceled  → status: "canceled"
 *
 * Env vars:
 *   - VERCEL_WEBHOOK_SECRET (optional, enables signature verification)
 *   - DEPLOY_APP_NAME       (default: "web")
 */

async function verifyVercelSignature(
  payload: string,
  signature: string | null,
  secret: string
): Promise<boolean> {
  if (!signature) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );

  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  const expectedSignature = Array.from(new Uint8Array(signed))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time comparison to prevent timing attacks
  if (expectedSignature.length !== signature.length) return false;

  let mismatch = 0;
  for (let i = 0; i < expectedSignature.length; i++) {
    mismatch |=
      (expectedSignature.charCodeAt(i) ?? 0) ^
      (signature.charCodeAt(i) ?? 0);
  }
  return mismatch === 0;
}

export async function POST(request: NextRequest) {
  if (!features.vercelWebhook) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const body = await request.text();

    // Verify webhook signature if secret is configured
    const secret = process.env.VERCEL_WEBHOOK_SECRET;
    if (secret) {
      const signature = request.headers.get("x-vercel-signature");
      const isValid = await verifyVercelSignature(
        body,
        signature,
        secret
      );
      if (!isValid) {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: "INVALID_SIGNATURE",
            message: "Vercel webhook signature verification failed",
          },
        };
        return NextResponse.json(response, { status: 401 });
      }
    }

    const payload = JSON.parse(body);
    const { type, payload: eventPayload } = payload;
    const { deployment } = eventPayload ?? {};

    if (!deployment) {
      return NextResponse.json(
        { error: "No deployment data in payload" },
        { status: 400 }
      );
    }

    // Extract data from the Vercel deployment
    const deploymentId: string = deployment.id;
    const deploymentUrl: string = deployment.url;
    const gitCommit: string | null =
      deployment.meta?.githubCommitSha?.substring(0, 7) ?? null;
    const target: string = eventPayload.target ?? "preview";

    // Map webhook type → our status
    let deploymentStatus: string;
    let deploymentError: string | null = null;

    switch (type) {
      case "deployment.created":
        deploymentStatus = "building";
        break;
      case "deployment.succeeded":
        deploymentStatus = "deployed";
        break;
      case "deployment.error":
        deploymentStatus = "failed";
        deploymentError =
          deployment.errorMessage ?? "Deployment failed";
        break;
      case "deployment.canceled":
        deploymentStatus = "canceled";
        break;
      default:
        return NextResponse.json({
          message: "Event type ignored",
        });
    }

    const appName = (process.env.DEPLOY_APP_NAME ?? "web") as
      "web" | "mobile_ios" | "mobile_android";
    const supabase = createAdminClient();

    // Find the matching app_versions record
    let versionId: string | null = null;

    // Try by git commit (most reliable)
    if (gitCommit) {
      const { data: versionByCommit } = await supabase
        .from("app_versions")
        .select("id")
        .eq("git_commit_sha", gitCommit)
        .eq("app_name", appName)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      versionId = versionByCommit?.id ?? null;
    }

    // Fallback: most recent pending version within 10 minutes
    if (!versionId) {
      const tenMinutesAgo = new Date(
        Date.now() - 10 * 60 * 1000
      ).toISOString();
      const { data: recentVersion } = await supabase
        .from("app_versions")
        .select("id")
        .eq("app_name", appName)
        .gte("created_at", tenMinutesAgo)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      versionId = recentVersion?.id ?? null;
    }

    // If still no match, create a new record from the webhook data
    if (!versionId) {
      const { data: inserted, error: insertError } = await supabase
        .from("app_versions")
        .insert({
          app_name: appName,
          version: `deploy-${deploymentId.slice(0, 8)}`,
          environment:
            target === "production"
              ? ("production" as const)
              : ("staging" as const),
          deployment_provider: "vercel" as const,
          status: deploymentStatus as "pending" | "building" | "deployed" | "failed" | "canceled",
          git_commit_sha: gitCommit,
          changelog:
            (deployment.meta?.githubCommitMessage as string) ?? null,
          deployment_id: deploymentId,
          deployment_url: `https://${deploymentUrl}`,
          deployed_at:
            deploymentStatus === "deployed"
              ? new Date().toISOString()
              : new Date().toISOString(),
          build_metadata: deploymentError
            ? { error: deploymentError, target }
            : { target },
        })
        .select("id")
        .single();

      if (insertError) {
        const response: ApiResponse<null> = {
          data: null,
          error: {
            code: "DB_ERROR",
            message: `Failed to create version record: ${insertError.message}`,
          },
        };
        return NextResponse.json(response, { status: 500 });
      }

      const response: ApiResponse<{
        id: string;
        status: string;
      }> = {
        data: { id: inserted.id, status: deploymentStatus },
        error: null,
      };
      return NextResponse.json(response, { status: 201 });
    }

    // Update the existing record
    const { error: updateError } = await supabase
      .from("app_versions")
      .update({
        status: deploymentStatus as "pending" | "building" | "deployed" | "failed" | "canceled",
        deployment_id: deploymentId,
        deployment_url: `https://${deploymentUrl}`,
        deployment_provider: "vercel" as const,
        ...(deploymentStatus === "deployed"
          ? { deployed_at: new Date().toISOString() }
          : {}),
        ...(deploymentError
          ? { build_metadata: { error: deploymentError, target } }
          : {}),
      })
      .eq("id", versionId);

    if (updateError) {
      console.error("Error updating app_version:", updateError);
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "DB_ERROR",
          message: `Failed to update version: ${updateError.message}`,
        },
      };
      return NextResponse.json(response, { status: 500 });
    }

    console.log("✅ Updated deployment status:", {
      versionId,
      status: deploymentStatus,
      deploymentId,
      gitCommit,
    });

    const response: ApiResponse<{ id: string; status: string }> = {
      data: { id: versionId, status: deploymentStatus },
      error: null,
    };
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Vercel webhook handler failed";
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "WEBHOOK_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
