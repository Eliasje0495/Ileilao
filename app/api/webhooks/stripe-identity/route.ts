import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { KycStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", { apiVersion: "2026-03-25.dahlia" });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_IDENTITY_WEBHOOK_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) return NextResponse.json({ error: "Missing signature." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Signature invalid." }, { status: 400 });
  }

  const session = event.data.object as Stripe.Identity.VerificationSession;
  const userId = session.metadata?.userId;
  if (!userId) return NextResponse.json({ received: true });

  if (event.type === "identity.verification_session.verified") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: KycStatus.VERIFIED,
        kycVerifiedAt: new Date(),
        onboardingStep: 5,
      },
    });
  }

  if (event.type === "identity.verification_session.requires_input") {
    await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: KycStatus.REJECTED },
    });
  }

  return NextResponse.json({ received: true });
}
