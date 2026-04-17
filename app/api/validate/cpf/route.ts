import { NextRequest, NextResponse } from "next/server";

// Brazilian CPF validation algorithm (Receita Federal check-digit rules)
function isValidCpf(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, "");
  if (clean.length !== 11) return false;
  // Reject all-same digits (e.g. 111.111.111-11)
  if (/^(\d)\1{10}$/.test(clean)) return false;

  function calcDigit(digits: string, weights: number[]): number {
    const sum = digits.split("").reduce((acc, d, i) => acc + parseInt(d) * weights[i], 0);
    const rem = sum % 11;
    return rem < 2 ? 0 : 11 - rem;
  }

  const d1 = calcDigit(clean.slice(0, 9), [10,9,8,7,6,5,4,3,2]);
  if (d1 !== parseInt(clean[9])) return false;
  const d2 = calcDigit(clean.slice(0, 10), [11,10,9,8,7,6,5,4,3,2]);
  if (d2 !== parseInt(clean[10])) return false;
  return true;
}

export async function POST(req: NextRequest) {
  const { cpf } = await req.json();
  if (!cpf) return NextResponse.json({ valid: false, error: "CPF é obrigatório." }, { status: 400 });

  const valid = isValidCpf(cpf);
  if (!valid) return NextResponse.json({ valid: false, error: "CPF inválido." }, { status: 422 });

  return NextResponse.json({ valid: true });
}
