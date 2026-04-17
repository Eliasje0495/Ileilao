import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "Mínimo 6 caracteres." }, { status: 400 });

  const user = await prisma.user.findFirst({
    where: {
      emailVerifyToken: token,
      emailVerifyExpiry: { gt: new Date() },
    },
  });

  if (!user) return NextResponse.json({ error: "Link inválido ou expirado." }, { status: 400 });

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      emailVerifyToken: null,
      emailVerifyExpiry: null,
    },
  });

  return NextResponse.json({ ok: true });
}
