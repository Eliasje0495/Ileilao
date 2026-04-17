import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { KycStatus, CaucaoStatus } from "@prisma/client";
import Stripe from "stripe";

// Caução = 10% of startPrice, min R$500
function calcCaucao(startPrice: number) {
  return Math.max(500, Math.round(startPrice * 0.1 * 100)) / 100;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  if (session.user.kycStatus !== KycStatus.VERIFIED) {
    return NextResponse.json({ error: "Complete sua verificação KYC antes de pagar a caução." }, { status: 403 });
  }

  const { lotId } = await req.json();
  if (!lotId) return NextResponse.json({ error: "lotId é obrigatório." }, { status: 400 });

  const lot = await prisma.lot.findUnique({ where: { id: lotId } });
  if (!lot) return NextResponse.json({ error: "Lote não encontrado." }, { status: 404 });

  // Check if caução already exists and is active
  const existing = await prisma.caucao.findUnique({ where: { userId_lotId: { userId: session.user.id, lotId } } });
  if (existing && existing.status === CaucaoStatus.HELD) {
    return NextResponse.json({ error: "Você já possui caução ativa para este lote." }, { status: 409 });
  }

  const amount = calcCaucao(Number(lot.startPrice));
  const amountCents = Math.round(amount * 100);

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe não configurado." }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-03-25.dahlia" });
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: "brl",
    capture_method: "manual", // hold funds, don't capture yet
    metadata: { userId: session.user.id, lotId, type: "caucao" },
    description: `Caução — ${lot.title}`,
  });

  // Upsert caucao record
  await prisma.caucao.upsert({
    where: { userId_lotId: { userId: session.user.id, lotId } },
    create: { userId: session.user.id, lotId, amount, stripePaymentIntentId: paymentIntent.id },
    update: { amount, stripePaymentIntentId: paymentIntent.id, status: CaucaoStatus.PENDING },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret, amount });
}
