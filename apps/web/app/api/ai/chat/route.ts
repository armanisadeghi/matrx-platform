import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@matrx/shared";

/**
 * AI Chat API Route
 *
 * Proxies prompt execution requests to the Matrx AI backend.
 * All business logic lives here — clients never call AI providers directly.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Validate request body with Zod schema
    // TODO: Authenticate request
    // TODO: Forward to Matrx AI backend
    // TODO: Stream response back to client

    const response: ApiResponse<{ message: string }> = {
      data: { message: "AI chat endpoint ready. Connect your Matrx AI backend." },
      error: null,
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "INTERNAL_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
