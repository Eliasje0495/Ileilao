import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email, uf } = await req.json();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  const emailLower = email.toLowerCase().trim();

  // Upsert: if user exists update uf, else store as newsletter lead
  const existing = await prisma.user.findUnique({ where: { email: emailLower } });
  if (existing) {
    if (uf && !existing.uf) {
      await prisma.user.update({ where: { id: existing.id }, data: { uf } });
    }
  } else {
    // Store as unverified user (newsletter subscriber)
    await prisma.user.upsert({
      where: { email: emailLower },
      update: { uf: uf ?? undefined },
      create: {
        email: emailLower,
        name: emailLower.split("@")[0],
        password: "",
        emailVerified: false,
        uf: uf ?? null,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
