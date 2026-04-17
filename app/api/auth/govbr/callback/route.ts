import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const GOVBR_TOKEN_URL = "https://sso.acesso.gov.br/token";
const GOVBR_USERINFO_URL = "https://sso.acesso.gov.br/userinfo";

interface GovBrUserInfo {
  sub: string;       // CPF (subject identifier)
  name: string;
  email?: string;
  phone_number?: string;
  picture?: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/login?error=govbr`);
  }

  const clientId = process.env.GOVBR_CLIENT_ID;
  const clientSecret = process.env.GOVBR_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/govbr/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/login?error=config`);
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch(GOVBR_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
    });

    if (!tokenRes.ok) throw new Error("Token exchange failed");
    const tokens = await tokenRes.json() as { access_token: string };

    // Get user info
    const userInfoRes = await fetch(GOVBR_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoRes.ok) throw new Error("UserInfo failed");
    const userInfo = await userInfoRes.json() as GovBrUserInfo;

    // Find or create user
    let user = await prisma.user.findFirst({ where: { govBrSub: userInfo.sub } });

    if (!user && userInfo.email) {
      user = await prisma.user.findUnique({ where: { email: userInfo.email } });
      if (user) {
        // Link gov.br to existing account
        user = await prisma.user.update({ where: { id: user.id }, data: { govBrSub: userInfo.sub } });
      }
    }

    if (!user) {
      // Auto-register via Gov.br — identity pre-verified
      user = await prisma.user.create({
        data: {
          govBrSub: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email ?? `${userInfo.sub}@govbr.user`,
          password: "", // no password — gov.br only login
          kycStatus: "VERIFIED", // Gov.br = identity already verified by government
          kycVerifiedAt: new Date(),
        },
      });
    }

    // Use NextAuth signIn — redirect to login with pre-filled token
    // For now: redirect to dashboard with success param
    // TODO: set NextAuth session programmatically
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/login?govbr=1&email=${encodeURIComponent(user.email)}`);

  } catch {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/login?error=govbr`);
  }
}
