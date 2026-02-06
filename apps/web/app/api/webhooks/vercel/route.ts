import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { features } from "@/lib/features";
import type { ApiResponse } from "@matrx/shared";

/**
 * Vercel Webhook Handler
 *
 * Processes Vercel deployment webhook events.
 * Verifies the webhook signature before processing.
 *
 * Handles:
 * - `deployment.succeeded` — marks version as deployed
 * - `deployment.failed` — marks version as failed
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

  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const expectedSignature = Array.from(new Uint8Array(signed))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const a = new TextEncoder().encode(expectedSignature);
  const b = new TextEncoder().encode(signature);

  if (a.byteLength !== b.byteLength) return false;

  return crypto.subtle.timingSafeEqual(a, b);
}

interface VercelDeploymentPayload {
  type: string;
  payload: {
    deployment: {
      id: string;
      name: string;
      url: string;
      meta?: {
        githubCommitSha?: string;
        githubCommitMessage?: string;
        githubCommitAuthorName?: string;
        githubCommitRef?: string;
      };
    };
    target?: string;
  };
}

export async function POST(request: NextRequest) {
  if (!features.vercelWebhook) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const secret = process.env.VERCEL_WEBHOOK_SECRET;
    if (!secret) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "CONFIG_ERROR",
          message: "Vercel webhook secret is not configured",
        },
      };
      return NextResponse.json(response, { status: 500 });
    }

    const body = await request.text();
    const signature = request.headers.get("x-vercel-signature");

    const isValid = await verifyVercelSignature(body, signature, secret);
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

    const event = JSON.parse(body) as VercelDeploymentPayload;
    const { type, payload: eventPayload } = event;
    const { deployment } = eventPayload;
    const target = eventPayload.target ?? "preview";
    const meta = deployment.meta;

    if (type === "deployment.succeeded" || type === "deployment.failed") {
      const status = type === "deployment.succeeded" ? "deployed" : "failed";

      const supabase = await createServerSupabaseClient();

      // Try to update an existing version record by commit SHA
      if (meta?.githubCommitSha) {
        const { data: existing } = await supabase
          .from("app_versions")
          .select("id")
          .eq("commit_sha", meta.githubCommitSha)
          .maybeSingle();

        if (existing) {
          const { error: updateError } = await supabase
            .from("app_versions")
            .update({
              status,
              deployed_at: status === "deployed" ? new Date().toISOString() : undefined,
              metadata: {
                vercel_deployment_id: deployment.id,
                vercel_url: deployment.url,
                target,
              },
            })
            .eq("id", existing.id);

          if (updateError) {
            const response: ApiResponse<null> = {
              data: null,
              error: {
                code: "DB_ERROR",
                message: `Failed to update version record: ${updateError.message}`,
              },
            };
            return NextResponse.json(response, { status: 500 });
          }

          const response: ApiResponse<{ id: string; status: string }> = {
            data: { id: existing.id, status },
            error: null,
          };
          return NextResponse.json(response);
        }
      }

      // No existing record — create a new one
      const { data: inserted, error: insertError } = await supabase
        .from("app_versions")
        .insert({
          app_name: deployment.name,
          version: `deploy-${deployment.id.slice(0, 8)}`,
          environment: target === "production" ? "production" : "staging",
          source: "vercel",
          status,
          commit_sha: meta?.githubCommitSha,
          commit_message: meta?.githubCommitMessage,
          author: meta?.githubCommitAuthorName ?? "vercel",
          deployed_at: status === "deployed" ? new Date().toISOString() : undefined,
          metadata: {
            vercel_deployment_id: deployment.id,
            vercel_url: deployment.url,
            target,
            github_ref: meta?.githubCommitRef,
          },
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

      const response: ApiResponse<{ id: string; status: string }> = {
        data: { id: inserted.id, status },
        error: null,
      };
      return NextResponse.json(response, { status: 201 });
    }

    // Unhandled event type — acknowledge receipt
    const response: ApiResponse<{ type: string }> = {
      data: { type },
      error: null,
    };
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Vercel webhook handler failed";
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "WEBHOOK_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
