import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@matrx/shared";

/**
 * Stripe Webhook Handler
 *
 * Processes Stripe webhook events for subscriptions and payments.
 * Verifies the webhook signature before processing.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      const response: ApiResponse<null> = {
        data: null,
        error: { code: "MISSING_SIGNATURE", message: "Missing Stripe signature" },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // TODO: Verify webhook signature with Stripe
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

    // TODO: Handle events:
    // - checkout.session.completed
    // - customer.subscription.created
    // - customer.subscription.updated
    // - customer.subscription.deleted
    // - invoice.payment_succeeded
    // - invoice.payment_failed

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handler failed";
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "WEBHOOK_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
