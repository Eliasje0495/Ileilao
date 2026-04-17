import { NextRequest, NextResponse } from "next/server";
import { Rest as AblyRest, type TokenParams } from "ably";

// Anonymous Ably token scoped to a single chat session channel
export async function POST(req: NextRequest) {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Ably not configured" }, { status: 503 });

  const { sessionId } = await req.json().catch(() => ({}));
  if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

  const client = new AblyRest(apiKey);
  const params: TokenParams = {
    clientId: `visitor-${sessionId}`,
    capability: JSON.stringify({ [`chat:${sessionId}`]: ["subscribe", "publish"] }),
    ttl: 3600 * 1000,
  };

  const tokenRequest = await client.auth.createTokenRequest(params);
  return NextResponse.json(tokenRequest);
}
