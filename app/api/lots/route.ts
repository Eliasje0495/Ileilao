import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role, LotCategory } from "@prisma/client";

const createSchema = z.object({
  auctionId: z.string(),
  title: z.string().min(3).max(300),
  description: z.string().optional(),
  category: z.nativeEnum(LotCategory).default(LotCategory.DIVERSOS),
  startPrice: z.number().positive(),
  minIncrement: z.number().positive(),
  appraisalValue: z.number().positive().nullable().optional(),
  reservePrice: z.number().positive().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  if (session.user.role !== Role.LEILOEIRO && session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Apenas leiloeiros podem criar lotes." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { auctionId, title, description, category, startPrice, minIncrement, appraisalValue, reservePrice } = parsed.data;

  const auction = await prisma.auction.findUnique({ where: { id: auctionId } });
  if (!auction) return NextResponse.json({ error: "Leilão não encontrado." }, { status: 404 });
  if (auction.leiloeiroId !== session.user.id && session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
  }

  const lot = await prisma.lot.create({
    data: {
      auctionId, title, description,
      category,
      startPrice,
      currentPrice: startPrice,
      minIncrement,
      appraisalValue: appraisalValue ?? null,
      reservePrice: reservePrice ?? null,
    },
  });

  return NextResponse.json({ lot }, { status: 201 });
}
