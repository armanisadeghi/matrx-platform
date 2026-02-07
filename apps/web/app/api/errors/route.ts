import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { features } from "@/lib/features";
import { errorReportSchema } from "@matrx/shared";
import type { ApiResponse } from "@matrx/shared";
import { ERROR_TRACKING } from "@matrx/shared";

/**
 * Error Ingestion API
 *
 * POST /api/errors — Receive error reports from all clients.
 *   - Accepts single events or batched arrays
 *   - Validates with Zod (drops invalid silently)
 *   - Uses DB functions for atomic upsert + rate limiting
 *   - Always returns 202 (fire-and-forget semantics)
 *
 * GET /api/errors — List error groups (admin, paginated).
 */

function extractTitle(message: string): string {
  // First line, truncated to 200 chars
  const firstLine = message.split("\n")[0] ?? message;
  return firstLine.length > 200 ? firstLine.slice(0, 197) + "..." : firstLine;
}

export async function POST(request: NextRequest) {
  // Feature flag gate — return 202 even when disabled (don't break clients)
  if (!features.errorTracking) {
    return NextResponse.json({ data: { accepted: 0 }, error: null }, { status: 202 });
  }

  try {
    const body = await request.json();
    const events = Array.isArray(body) ? body : [body];

    // Validate all events, silently drop invalid ones
    const validEvents = events
      .map((e: unknown) => errorReportSchema.safeParse(e))
      .filter((r) => r.success)
      .map((r) => r.data!);

    if (validEvents.length === 0) {
      return NextResponse.json({ data: { accepted: 0 }, error: null }, { status: 202 });
    }

    const supabase = await createServerSupabaseClient();

    let accepted = 0;

    for (const event of validEvents) {
      try {
        const fingerprint = event.fingerprint ?? simpleHash(
          normalizeForFingerprint(event.message, event.stackTrace)
        );

        // Server-side rate limit via DB function
        const { data: allowed } = await supabase.rpc("check_error_rate_limit", {
          p_fingerprint: fingerprint,
          p_window_minutes: ERROR_TRACKING.RATE_LIMIT_WINDOW_MINUTES,
          p_max_per_window: ERROR_TRACKING.RATE_LIMIT_MAX_PER_WINDOW,
        });

        if (allowed === false) continue;

        // Atomic upsert of error group (handles increment + status reopen)
        const { data: groupId } = await supabase.rpc("increment_error_group_count", {
          p_fingerprint: fingerprint,
          p_title: extractTitle(event.message),
          p_culprit: event.component ?? event.url ?? undefined,
          p_platform: event.platform,
          p_level: event.level ?? "error",
        });

        if (!groupId) continue;

        // Insert individual event
        await supabase.from("error_events").insert({
          group_id: groupId,
          message: event.message,
          stack_trace: event.stackTrace ?? null,
          platform: event.platform,
          environment: event.environment ?? "production",
          release: event.release ?? null,
          user_id: event.userId ?? null,
          user_agent: request.headers.get("user-agent"),
          ip_address: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
          url: event.url ?? null,
          component: event.component ?? null,
          action: event.action ?? null,
          breadcrumbs: event.breadcrumbs ?? [],
          context: event.context ?? {},
          tags: event.tags ?? {},
        });

        accepted++;
      } catch {
        // Individual event failures must not stop batch processing
        continue;
      }
    }

    const response: ApiResponse<{ accepted: number }> = {
      data: { accepted },
      error: null,
    };
    return NextResponse.json(response, { status: 202 });
  } catch {
    // The error tracker itself must NEVER fail
    return NextResponse.json({ data: { accepted: 0 }, error: null }, { status: 202 });
  }
}

export async function GET(request: NextRequest) {
  if (!features.errorTracking) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status") ?? undefined;
    const level = searchParams.get("level") ?? undefined;
    const platform = searchParams.get("platform") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const perPage = parseInt(searchParams.get("perPage") ?? "20", 10);

    const supabase = await createServerSupabaseClient();

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from("error_groups")
      .select("*", { count: "exact" })
      .order("last_seen_at", { ascending: false })
      .range(from, to);

    if (status) query = query.eq("status", status);
    if (level) query = query.eq("level", level);
    if (platform) query = query.eq("platform", platform);
    if (search) query = query.ilike("title", `%${search}%`);

    const { data, error, count } = await query;

    if (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: { code: "DB_ERROR", message: error.message },
      };
      return NextResponse.json(response, { status: 500 });
    }

    const response: ApiResponse<typeof data> = {
      data,
      error: null,
      meta: {
        page,
        perPage,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / perPage),
      },
    };
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch error groups";
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "INTERNAL_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// ─── Fingerprinting helpers ──────────────────────────────

function normalizeForFingerprint(message: string, stackTrace?: string): string {
  let normalized = message
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "{{uuid}}")
    .replace(/\b\d+\b/g, "{{n}}")
    .replace(/"[^"]{50,}"/g, '"{{str}}"')
    .toLowerCase()
    .trim();

  if (stackTrace) {
    const frames = stackTrace
      .split("\n")
      .filter((line) => line.includes("at "))
      .slice(0, 3)
      .map((line) => {
        const match = line.match(/at\s+(\S+).*?([^/\\]+\.\w+)/);
        return match ? `${match[1]}@${match[2]}` : line.trim();
      });
    normalized += "|" + frames.join("|");
  }

  return normalized;
}

function simpleHash(str: string): string {
  let hash1 = 5381;
  let hash2 = 52711;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash1 = (hash1 * 33) ^ char;
    hash2 = (hash2 * 33) ^ char;
  }
  return (
    (hash1 >>> 0).toString(16).padStart(8, "0") +
    (hash2 >>> 0).toString(16).padStart(8, "0")
  );
}
