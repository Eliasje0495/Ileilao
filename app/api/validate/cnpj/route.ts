import { NextRequest, NextResponse } from "next/server";

function isValidCnpj(cnpj: string): boolean {
  const c = cnpj.replace(/\D/g, "");
  if (c.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(c)) return false;

  function calc(digits: string, weights: number[]) {
    const sum = digits.split("").reduce((acc, d, i) => acc + parseInt(d) * weights[i], 0);
    const rem = sum % 11;
    return rem < 2 ? 0 : 11 - rem;
  }

  const w1 = [5,4,3,2,9,8,7,6,5,4,3,2];
  const w2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
  if (calc(c.slice(0,12), w1) !== parseInt(c[12])) return false;
  if (calc(c.slice(0,13), w2) !== parseInt(c[13])) return false;
  return true;
}

export async function POST(req: NextRequest) {
  const { cnpj } = await req.json();
  if (!cnpj) return NextResponse.json({ valid: false, error: "CNPJ é obrigatório." }, { status: 400 });

  const clean = cnpj.replace(/\D/g, "");
  if (!isValidCnpj(clean)) return NextResponse.json({ valid: false, error: "CNPJ inválido." }, { status: 422 });

  // Enrich with BrasilAPI (Receita Federal data)
  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${clean}`, {
      headers: { "User-Agent": "ileilao.com" },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json() as { razao_social?: string; situacao_cadastral?: string; descricao_situacao_cadastral?: string };
      return NextResponse.json({
        valid: true,
        razaoSocial: data.razao_social ?? null,
        situacao: data.descricao_situacao_cadastral ?? null,
        ativa: data.situacao_cadastral === "2" || data.descricao_situacao_cadastral?.toLowerCase() === "ativa",
      });
    }
  } catch {}

  return NextResponse.json({ valid: true });
}
