import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();

  if (!email || !code) return NextResponse.json({ error: "E-mail e código são obrigatórios." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

  if (!user) return NextResponse.json({ error: "Conta não encontrada." }, { status: 404 });
  if (user.emailVerified) return NextResponse.json({ ok: true, alreadyVerified: true });

  if (!user.emailVerifyToken || user.emailVerifyToken !== code.trim()) {
    return NextResponse.json({ error: "Código inválido." }, { status: 400 });
  }

  if (!user.emailVerifyExpiry || user.emailVerifyExpiry < new Date()) {
    return NextResponse.json({ error: "Código expirado. Solicite um novo." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, emailVerifyToken: null, emailVerifyExpiry: null },
  });

  return NextResponse.json({ ok: true, name: user.name });
}

// Resend code
export async function PUT(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "E-mail é obrigatório." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) return NextResponse.json({ error: "Conta não encontrada." }, { status: 404 });
  if (user.emailVerified) return NextResponse.json({ ok: true });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifyToken: code, emailVerifyExpiry: expiry },
  });

  const { sendVerificationEmail } = await import("@/lib/email");
  await sendVerificationEmail(user.email, user.name, code);

  return NextResponse.json({ ok: true });
}
