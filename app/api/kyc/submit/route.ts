import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { KycStatus } from "@prisma/client";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const docs = await prisma.kycDocument.findMany({ where: { userId: session.user.id } });
  const requiredTypes = ["CPF", "RG", "COMPROVANTE"];
  const hasAll = requiredTypes.every(t => docs.some(d => d.type === t || (t === "RG" && d.type === "CNH")));

  if (!hasAll) return NextResponse.json({ error: "Envie todos os documentos obrigatórios antes de submeter." }, { status: 400 });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { kycStatus: KycStatus.PENDING },
  });

  return NextResponse.json({ ok: true });
}
