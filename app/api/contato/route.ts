import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, assunto, mensagem } = await req.json();
  if (!name || !email || !mensagem) return NextResponse.json({ error: "Campos obrigatórios." }, { status: 400 });

  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "iLeilão Contato <noreply@ileilao.com>",
      to: "suporte@ileilao.com",
      replyTo: email,
      subject: `[Contato] ${assunto || "Nova mensagem"} — ${name}`,
      html: `
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${assunto}</p>
        <hr/>
        <p>${mensagem.replace(/\n/g, "<br/>")}</p>
      `,
    });
  }

  return NextResponse.json({ ok: true });
}
