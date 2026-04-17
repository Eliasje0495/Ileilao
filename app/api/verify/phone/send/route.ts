import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Supports: channel = "sms" | "whatsapp"
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const { phone, channel = "sms" } = await req.json();
  if (!phone) return NextResponse.json({ error: "Telefone é obrigatório." }, { status: 400 });

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!sid || !token || !serviceSid) {
    // Dev fallback — log code to console
    console.log(`[SMS DEV] Would send ${channel.toUpperCase()} to ${phone}`);
    return NextResponse.json({ ok: true, dev: true });
  }

  // Clean phone: add +55 prefix if not present
  const e164 = phone.replace(/\D/g, "").replace(/^0/, "").replace(/^55/, "+55").replace(/^(?!\+)/, "+55");

  try {
    const twilio = await import("twilio");
    const client = twilio.default(sid, token);

    await client.verify.v2.services(serviceSid).verifications.create({
      to: channel === "whatsapp" ? `whatsapp:${e164}` : e164,
      channel,
    });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro ao enviar código.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
