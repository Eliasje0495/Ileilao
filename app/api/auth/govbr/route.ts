import { NextResponse } from "next/server";

// Gov.br (Acesso Gov) OAuth2 — Login Único do Governo Federal
// Docs: https://manual-roteiro-integracao-login-unico.servicos.gov.br/
// Requires: GOVBR_CLIENT_ID, GOVBR_CLIENT_SECRET in env vars
// Register at: https://www.gov.br/governodigital/pt-br/transformacao-digital/ferramentas/login-govbr

const GOVBR_AUTH_URL = "https://sso.acesso.gov.br/authorize";
const SCOPES = ["openid", "email", "profile", "govbr_confiabilidades"].join(" ");

export async function GET() {
  const clientId = process.env.GOVBR_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "Gov.br não configurado. Adicione GOVBR_CLIENT_ID nas variáveis de ambiente." },
      { status: 503 }
    );
  }

  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/govbr/callback`;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: SCOPES,
    redirect_uri: redirectUri,
    nonce: crypto.randomUUID(),
    state: crypto.randomUUID(),
  });

  return NextResponse.redirect(`${GOVBR_AUTH_URL}?${params.toString()}`);
}
