import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "session_id required" }, { status: 400 });
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ status: "pending" });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-03-25.dahlia" });
  const session = await stripe.identity.verificationSessions.retrieve(sessionId);
  return NextResponse.json({ status: session.status });
}
