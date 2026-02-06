import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { features } from "@/lib/features";
import type { ApiResponse } from "@matrx/shared";

/**
 * GitHub Webhook Handler
 *
 * Processes GitHub webhook events for deployment tracking.
 * Verifies the webhook signature using HMAC-SHA256 before processing.
 *
 * Handles:
 * - `push` events to track deployments
 * - Tag pushes to create app_versions records
 */

async function verifyGitHubSignature(
  payload: string,
  signature: string | null,
  secret: string
): Promise<boolean> {
  if (!signature) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const expectedSignature = `sha256=${Array.from(new Uint8Array(signed))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}`;

  // Use timing-safe comparison
  const a = new TextEncoder().encode(expectedSignature);
  const b = new TextEncoder().encode(signature);

  if (a.byteLength !== b.byteLength) return false;

  return crypto.subtle.timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  if (!features.githubWebhook) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "CONFIG_ERROR",
          message: "GitHub webhook secret is not configured",
        },
      };
      return NextResponse.json(response, { status: 500 });
    }

    const body = await request.text();
    const signature = request.headers.get("x-hub-signature-256");

    const isValid = await verifyGitHubSignature(body, signature, secret);
    if (!isValid) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "INVALID_SIGNATURE",
          message: "GitHub webhook signature verification failed",
        },
      };
      return NextResponse.json(response, { status: 401 });
    }

    const event = request.headers.get("x-github-event");
    const payload = JSON.parse(body) as Record<string, unknown>;

    if (event === "push") {
      const ref = payload.ref as string;
      const isTag = ref.startsWith("refs/tags/");

      if (isTag) {
        const tagName = ref.replace("refs/tags/", "");
        const repository = payload.repository as Record<string, unknown>;
        const pusher = payload.pusher as Record<string, unknown>;
        const headCommit = payload.head_commit as Record<string, unknown> | null;

        const supabase = await createServerSupabaseClient();
        const { error: insertError } = await supabase
          .from("app_versions")
          .insert({
            version: tagName,
            app_name: (repository?.name as string) ?? "unknown",
            environment: tagName.includes("-rc") ? "staging" : "production",
            source: "github",
            commit_sha: headCommit?.id as string | undefined,
            commit_message: headCommit?.message as string | undefined,
            author: (pusher?.name as string) ?? "unknown",
            metadata: {
              repository: repository?.full_name,
              ref,
              compare_url: payload.compare,
            },
            status: "pending",
          });

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

        const response: ApiResponse<{ version: string; event: string }> = {
          data: { version: tagName, event: "tag_push" },
          error: null,
        };
        return NextResponse.json(response, { status: 201 });
      }

      // Non-tag push — acknowledge but do not create a version record
      const response: ApiResponse<{ event: string }> = {
        data: { event: "push" },
        error: null,
      };
      return NextResponse.json(response);
    }

    // Unhandled event type — acknowledge receipt
    const response: ApiResponse<{ event: string | null }> = {
      data: { event },
      error: null,
    };
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "GitHub webhook handler failed";
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "WEBHOOK_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
