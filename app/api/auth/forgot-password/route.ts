import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "E-mail obrigatório." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

  // Always return 200 to avoid user enumeration
  if (!user) return NextResponse.json({ ok: true });

  // Generate a secure token
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerifyToken: token,
      emailVerifyExpiry: expiry,
    },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  if (process.env.RESEND_API_KEY) {
    await resend.emails.send({
      from: "iLeilão <noreply@ileilao.com>",
      to: user.email,
      subject: "Redefinição de senha — iLeilão",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
          <h2 style="color:#1e40af;font-size:24px;margin-bottom:8px">Redefinição de senha</h2>
          <p style="color:#6b7280;font-size:14px">Olá, ${user.name.split(" ")[0]}!</p>
          <p style="color:#374151;font-size:14px">Recebemos uma solicitação para redefinir a senha da sua conta iLeilão.</p>
          <p style="color:#374151;font-size:14px">Clique no botão abaixo para criar uma nova senha. O link é válido por <strong>1 hora</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;margin:24px 0;background:#2563eb;color:white;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:14px">
            Redefinir minha senha
          </a>
          <p style="color:#9ca3af;font-size:12px">Se você não solicitou a redefinição, ignore este e-mail — sua senha permanece a mesma.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
          <p style="color:#9ca3af;font-size:11px">iLeilão · ileilao.com</p>
        </div>
      `,
    });
  }

  return NextResponse.json({ ok: true });
}
