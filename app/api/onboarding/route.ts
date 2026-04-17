import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const step1Schema = z.object({
  step: z.literal(1),
  username: z.string().min(6, "Mínimo 6 caracteres").max(30).regex(/^[a-zA-Z0-9_]+$/, "Apenas letras, números e _"),
  referralSource: z.string().min(1),
  phone: z.string().min(10),
  acceptWhatsapp: z.boolean(),
  acceptTerms: z.boolean(),
});

const step2PfSchema = z.object({
  step: z.literal(2),
  tipoCadastro: z.literal("PF"),
  cpf: z.string().min(11).max(14).optional(),
  birthDate: z.string(),
  isEstrangeiro: z.boolean().optional(),
  nacionalidade: z.string().optional(),
  rg: z.string().optional(),
  telefoneFixo: z.string().optional(),
  estadoCivil: z.string().optional(),
  profissao: z.string().optional(),
});

const step2PjSchema = z.object({
  step: z.literal(2),
  tipoCadastro: z.literal("PJ"),
  cnpj: z.string().min(14).max(18),
  razaoSocial: z.string().min(2),
  inscricaoEstadual: z.string().optional(),
  dataAbertura: z.string(),
  nomeSocio: z.string().min(2),
  cpfSocio: z.string().min(11),
  nomeContato: z.string().min(2),
  telefoneComercial: z.string().optional(),
});

const step2Schema = z.discriminatedUnion("tipoCadastro", [step2PfSchema, step2PjSchema]);

const step3Schema = z.object({
  step: z.literal(3),
  addressCep: z.string().min(8).max(9),
  addressStreet: z.string().min(2),
  addressNumber: z.string().min(1),
  addressComplement: z.string().optional(),
  addressNeighborhood: z.string().min(2),
  addressCity: z.string().min(2),
  addressUf: z.string().length(2),
});

const step4Schema = z.object({
  step: z.literal(4),
  selfieUrl: z.string().min(1),
});

const step5Schema = z.object({
  step: z.literal(5),
  docFrontUrl: z.string().min(1),
  docBackUrl: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const body = await req.json();
  const { step } = body;

  try {
    if (step === 1) {
      const d = step1Schema.parse(body);
      if (!d.acceptTerms) return NextResponse.json({ error: "Aceite os termos de uso para continuar." }, { status: 400 });
      const exists = await prisma.user.findFirst({ where: { username: d.username, NOT: { id: session.user.id } } });
      if (exists) return NextResponse.json({ error: "Esse usuário já está em uso." }, { status: 409 });
      await prisma.user.update({
        where: { id: session.user.id },
        data: { username: d.username, referralSource: d.referralSource, phone: d.phone, acceptWhatsapp: d.acceptWhatsapp, acceptTerms: d.acceptTerms, onboardingStep: 1 },
      });
    } else if (step === 2) {
      const d = step2Schema.parse(body);
      if (d.tipoCadastro === "PF") {
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            tipoCadastro: "PF",
            cpf: d.cpf ?? null,
            birthDate: new Date(d.birthDate),
            isEstrangeiro: d.isEstrangeiro ?? false,
            nacionalidade: d.nacionalidade ?? null,
            rg: d.rg ?? null,
            telefoneFixo: d.telefoneFixo ?? null,
            estadoCivil: d.estadoCivil ?? null,
            profissao: d.profissao ?? null,
            onboardingStep: 2,
          },
        });
      } else {
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            tipoCadastro: "PJ", cnpj: d.cnpj, razaoSocial: d.razaoSocial,
            inscricaoEstadual: d.inscricaoEstadual ?? null,
            dataAbertura: new Date(d.dataAbertura), nomeSocio: d.nomeSocio,
            cpfSocio: d.cpfSocio, nomeContato: d.nomeContato,
            telefoneComercial: d.telefoneComercial ?? null, onboardingStep: 2,
          },
        });
      }
    } else if (step === 3) {
      const d = step3Schema.parse(body);
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          addressCep: d.addressCep, addressStreet: d.addressStreet, addressNumber: d.addressNumber,
          addressComplement: d.addressComplement ?? null, addressNeighborhood: d.addressNeighborhood,
          addressCity: d.addressCity, addressUf: d.addressUf, onboardingStep: 3,
        },
      });
    } else if (step === 4) {
      const d = step4Schema.parse(body);
      await prisma.user.update({ where: { id: session.user.id }, data: { selfieUrl: d.selfieUrl, onboardingStep: 4 } });
    } else if (step === 5) {
      step5Schema.parse(body);
      await prisma.user.update({
        where: { id: session.user.id },
        data: { onboardingStep: 5, kycStatus: "PENDING" },
      });
    } else {
      return NextResponse.json({ error: "Step inválido." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
