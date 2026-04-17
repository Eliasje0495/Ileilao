import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe não configurado." }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-03-25.dahlia" });

  const baseUrl = process.env.NEXTAUTH_URL ?? "https://ileilao.com";

  const verificationSession = await stripe.identity.verificationSessions.create({
    type: "document",
    metadata: { userId: session.user.id },
    options: {
      document: {
        require_id_number: true,        // validates CPF against document
        require_live_capture: true,      // no uploads — must be live camera
        require_matching_selfie: true,   // selfie must match document photo
      },
    },
    return_url: `${baseUrl}/onboarding/identidade/retorno`,
  } as Parameters<typeof stripe.identity.verificationSessions.create>[0]);

  // Save session ID for webhook matching
  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStep: 3 }, // reached step 4
  });

  return NextResponse.json({
    url: verificationSession.url,
    sessionId: verificationSession.id,
  });
}
