import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role, KycStatus } from "@prisma/client";

// GET — list users with PENDING KYC
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { kycStatus: KycStatus.PENDING },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      kycDocuments: {
        select: { id: true, type: true, url: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ users });
}

// PATCH — approve or reject KYC
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const { userId, action } = await req.json();
  if (!userId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const newStatus = action === "approve" ? KycStatus.VERIFIED : KycStatus.REJECTED;

  await prisma.user.update({
    where: { id: userId },
    data: { kycStatus: newStatus },
  });

  return NextResponse.json({ ok: true, kycStatus: newStatus });
}
