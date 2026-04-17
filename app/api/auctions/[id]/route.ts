import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role, AuctionStatus } from "@prisma/client";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const auction = await prisma.auction.findUnique({
    where: { id },
    include: {
      leiloeiro: { select: { id: true, name: true } },
      lots: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!auction) return NextResponse.json({ error: "Leilão não encontrado." }, { status: 404 });
  return NextResponse.json({ auction });
}

const patchSchema = z.object({
  status: z.nativeEnum(AuctionStatus).optional(),
  title: z.string().min(3).max(200).optional(),
  description: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const { id } = await params;
  const auction = await prisma.auction.findUnique({ where: { id } });
  if (!auction) return NextResponse.json({ error: "Leilão não encontrado." }, { status: 404 });

  if (auction.leiloeiroId !== session.user.id && session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Sem permissão." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const updated = await prisma.auction.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ auction: updated });
}
