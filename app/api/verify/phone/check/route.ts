import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const { phone, code, channel = "sms" } = await req.json();
  if (!phone || !code) return NextResponse.json({ error: "Telefone e código são obrigatórios." }, { status: 400 });

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!sid || !token || !serviceSid) {
    // Dev mode: accept any 6-digit code
    if (code.length === 6) {
      await prisma.user.update({ where: { id: session.user.id }, data: { phone, phoneVerified: true } });
      return NextResponse.json({ ok: true, dev: true });
    }
    return NextResponse.json({ error: "Código inválido." }, { status: 400 });
  }

  const e164 = phone.replace(/\D/g, "").replace(/^0/, "").replace(/^55/, "+55").replace(/^(?!\+)/, "+55");

  try {
    const twilio = await import("twilio");
    const client = twilio.default(sid, token);

    const check = await client.verify.v2.services(serviceSid).verificationChecks.create({
      to: channel === "whatsapp" ? `whatsapp:${e164}` : e164,
      code,
    });

    if (check.status !== "approved") {
      return NextResponse.json({ error: "Código inválido ou expirado." }, { status: 400 });
    }

    await prisma.user.update({ where: { id: session.user.id }, data: { phone, phoneVerified: true } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro ao verificar código.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
