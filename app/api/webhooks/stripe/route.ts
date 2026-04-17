import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { CaucaoStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", { apiVersion: "2026-03-25.dahlia" });
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed." }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.amount_capturable_updated": {
      // Funds are authorized/held — caução is confirmed
      const pi = event.data.object as Stripe.PaymentIntent;
      if (pi.metadata.type === "caucao") {
        await prisma.caucao.updateMany({
          where: { stripePaymentIntentId: pi.id },
          data: { status: CaucaoStatus.HELD },
        });
      }
      break;
    }

    case "payment_intent.canceled": {
      const pi = event.data.object as Stripe.PaymentIntent;
      if (pi.metadata.type === "caucao") {
        await prisma.caucao.updateMany({
          where: { stripePaymentIntentId: pi.id },
          data: { status: CaucaoStatus.RELEASED },
        });
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      if (pi.metadata.type === "caucao") {
        await prisma.caucao.updateMany({
          where: { stripePaymentIntentId: pi.id },
          data: { status: CaucaoStatus.PENDING },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
