import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

const createSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  if (session.user.role !== Role.LEILOEIRO && session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Apenas leiloeiros podem criar leilões." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { title, description, startsAt, endsAt } = parsed.data;

  if (new Date(endsAt) <= new Date(startsAt)) {
    return NextResponse.json({ error: "A data de encerramento deve ser após o início." }, { status: 400 });
  }

  const auction = await prisma.auction.create({
    data: { title, description, leiloeiroId: session.user.id, startsAt: new Date(startsAt), endsAt: new Date(endsAt) },
  });

  return NextResponse.json({ auction }, { status: 201 });
}
