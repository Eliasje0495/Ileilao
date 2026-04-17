import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { placeBid } from "@/lib/bid-engine";

interface Params {
  params: Promise<{ id: string }>;
}

const bidSchema = z.object({
  amount: z
    .number({ error: "Valor do lance é obrigatório." })
    .positive("O valor do lance deve ser positivo.")
    .finite("O valor do lance deve ser um número finito."),
});

export async function POST(req: NextRequest, { params }: Params) {
  // 1. Auth check
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Você precisa estar autenticado para dar lances." },
      { status: 401 }
    );
  }

  const { id: lotId } = await params;

  // 2. Parse and validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const parsed = bidSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 422 }
    );
  }

  const { amount } = parsed.data;

  // 3. Collect request metadata
  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    undefined;
  const userAgent = req.headers.get("user-agent") ?? undefined;
  const deviceId = req.headers.get("x-device-id") ?? undefined;

  // 4. Place the bid
  const result = await placeBid({
    userId: session.user.id,
    lotId,
    amount,
    ipAddress,
    deviceId,
    userAgent,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(
    {
      bid: result.bid,
      lot: result.lot,
    },
    { status: 201 }
  );
}
