import { NextRequest, NextResponse } from "next/server";

interface EbookLead {
  name: string;
  email: string;
  phone: string;
  uf: string;
  interesse: string;
  tipo: string[];
  faixa: string;
}

// Format faixa label
function faixaLabel(faixa: string) {
  const map: Record<string, string> = {
    ate200: "Até R$ 200k",
    "200-500": "R$ 200k – 500k",
    "500-1m": "R$ 500k – 1M",
    "1m-2m": "R$ 1M – 2M",
    "2m-5m": "R$ 2M – 5M",
    acima5m: "Acima de R$ 5M",
  };
  return map[faixa] ?? faixa;
}

async function sendWhatsApp(to: string, body: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM ?? "whatsapp:+14155238886"; // Twilio sandbox default

  if (!accountSid || !authToken) {
    console.warn("[ebook-lead] Twilio credentials not set — skipping WhatsApp");
    return;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const params = new URLSearchParams({ From: from, To: `whatsapp:${to}`, Body: body });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[ebook-lead] Twilio error:", err);
  }
}

export async function POST(req: NextRequest) {
  const lead: EbookLead = await req.json();

  if (!lead.name || !lead.email) {
    return NextResponse.json({ error: "Nome e e-mail obrigatórios." }, { status: 400 });
  }

  // Build WhatsApp message for customer service
  const csMessage = [
    "🔔 *Novo lead — E-book iLeilão*",
    "",
    `👤 *Nome:* ${lead.name}`,
    `📧 *E-mail:* ${lead.email}`,
    `📱 *WhatsApp:* ${lead.phone || "não informado"}`,
    `📍 *Estado:* ${lead.uf || "não informado"}`,
    `🎯 *Interesse:* ${lead.interesse || "não informado"}`,
    `🏠 *Tipo de imóvel:* ${lead.tipo.length ? lead.tipo.join(", ") : "não informado"}`,
    `💰 *Faixa de preço:* ${lead.faixa ? faixaLabel(lead.faixa) : "não informado"}`,
    "",
    "→ Entre em contato via WhatsApp para enviar dicas e recomendações de lotes!",
  ].join("\n");

  // Send notification to each CS agent number
  const csNumbers = (process.env.CS_WHATSAPP_NUMBERS ?? "").split(",").map(n => n.trim()).filter(Boolean);
  await Promise.allSettled(csNumbers.map(num => sendWhatsApp(num, csMessage)));

  // If lead provided their own WhatsApp, send them a confirmation message
  if (lead.phone) {
    const leadMessage = [
      `Olá, ${lead.name.split(" ")[0]}! 👋`,
      "",
      "Ficamos muito felizes com seu interesse no e-book *Leilão de Imóveis do Zero*!",
      "",
      "Em breve nossa equipe vai entrar em contato para te enviar dicas personalizadas e as melhores oportunidades de leilão no seu estado.",
      "",
      "Acesse também nosso site para explorar os leilões disponíveis agora:",
      "👉 https://ileilao.com/leiloes",
      "",
      "— Equipe iLeilão",
    ].join("\n");

    await sendWhatsApp(lead.phone, leadMessage).catch(() => {
      // Non-fatal: user may not have opted into WhatsApp
    });
  }

  return NextResponse.json({ ok: true });
}
