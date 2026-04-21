import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { recordPaidPurchase, verifyStripeWebhookSignature } from "@/lib/lemonsqueezy";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  const valid = verifyStripeWebhookSignature(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);

  if (!valid) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }

  const eventType = String(event.type ?? "");
  const eventData = (event.data as { object?: Record<string, unknown> } | undefined)?.object ?? {};

  if (eventType === "checkout.session.completed") {
    const email =
      (eventData.customer_details as { email?: string } | undefined)?.email ??
      (eventData.customer_email as string | undefined);

    if (email) {
      const created = Number(eventData.created ?? Math.floor(Date.now() / 1000));
      await recordPaidPurchase({
        email: email.toLowerCase(),
        eventId: String(event.id ?? randomUUID()),
        purchasedAt: new Date(created * 1000).toISOString(),
        source: "stripe",
      });
    }
  }

  return NextResponse.json({ received: true });
}
