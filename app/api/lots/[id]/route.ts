import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role, LotStatus } from "@prisma/client";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const lot = await prisma.lot.findUnique({
    where: { id },
    include: {
      auction: { select: { id: true, title: true, status: true, startsAt: true, endsAt: true, leiloeiro: { select: { id: true, name: true } } } },
      winner: { select: { id: true, name: true } },
      bids: { where: { isValid: true }, orderBy: { timestamp: "desc" }, take: 50, select: { id: true, amount: true, timestamp: true, hashChain: true, user: { select: { id: true, name: true } } } },
      documents: { select: { id: true, type: true, url: true, hash: true, signedAt: true, createdAt: true } },
    },
  });
  if (!lot) return NextResponse.json({ error: "Lote não encontrado." }, { status: 404 });
  return NextResponse.json({ lot });
}

const patchSchema = z.object({
  status: z.nativeEnum(LotStatus).optional(),
  title: z.string().min(3).optional(),
  description: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const { id } = await params;
  const lot = await prisma.lot.findUnique({ where: { id }, include: { auction: true } });
  if (!lot) return NextResponse.json({ error: "Lote não encontrado." }, { status: 404 });

  if (lot.auction.leiloeiroId !== session.user.id && session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const updated = await prisma.lot.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ lot: updated });
}
