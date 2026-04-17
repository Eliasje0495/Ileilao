import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

const ESTADOS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(200),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  uf: z.string().refine(v => !v || ESTADOS.includes(v), "UF inválida").optional().nullable(),
  cidades: z.array(z.string().max(100)).max(5).optional().default([]),
});

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

    const { name, email, password, uf, cidades } = parsed.data;
    const emailLower = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email: emailLower } });
    if (existing) {
      if (!existing.emailVerified) {
        // Resend code
        const code = generateCode();
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min
        await prisma.user.update({
          where: { id: existing.id },
          data: { emailVerifyToken: code, emailVerifyExpiry: expiry },
        });
        await sendVerificationEmail(emailLower, existing.name, code);
        return NextResponse.json({ ok: true, email: emailLower }, { status: 200 });
      }
      return NextResponse.json({ error: "Este e-mail já está em uso." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const code = generateCode();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.create({
      data: {
        name, email: emailLower, password: hashedPassword,
        uf: uf ?? null, cidades: cidades ?? [],
        emailVerified: false,
        emailVerifyToken: code,
        emailVerifyExpiry: expiry,
      },
    });

    await sendVerificationEmail(emailLower, name, code);

    return NextResponse.json({ ok: true, email: emailLower }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
