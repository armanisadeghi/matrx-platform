import Stripe from "stripe";

/**
 * Server-side Stripe client.
 *
 * Only used in API routes — never exposed to the client.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});
