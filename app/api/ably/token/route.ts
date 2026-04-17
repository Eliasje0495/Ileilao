import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Rest as AblyRest, type TokenParams as AblyTokenParams } from "ably";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Ably não está configurado." },
      { status: 503 }
    );
  }

  // Token requests require authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Autenticação necessária para obter token Ably." },
      { status: 401 }
    );
  }

  // Parse optional channel scope from body
  let requestedLotId: string | undefined;
  try {
    const body = (await req.json()) as Record<string, unknown>;
    requestedLotId = typeof body.lotId === "string" ? body.lotId : undefined;
  } catch {
    // ignore parse errors — body is optional
  }

  const client = new AblyRest(apiKey);

  // Build capability — restrict to the relevant lot channel or all lot channels
  const capability = requestedLotId
    ? { [`lot:${requestedLotId}`]: ["subscribe"] }
    : { "lot:*": ["subscribe"] };

  const tokenParams: AblyTokenParams = {
    clientId: session.user.id,
    capability: JSON.stringify(capability),
    ttl: 3600 * 1000, // 1 hour in ms
  };

  try {
    const tokenRequest = await client.auth.createTokenRequest(tokenParams);
    return NextResponse.json(tokenRequest);
  } catch (err) {
    console.error("Failed to create Ably token:", err);
    return NextResponse.json(
      { error: "Não foi possível gerar o token de conexão em tempo real." },
      { status: 500 }
    );
  }
}
