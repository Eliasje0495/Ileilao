import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role, KycStatus } from "@prisma/client";

// Extend NextAuth types to include our custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      kycStatus: KycStatus;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    kycStatus: KycStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    kycStatus: KycStatus;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: { prompt: "login" },
      },
    }),
    // Gov.br OAuth2 — Login com Gov.br (acesso.gov.br)
    {
      id: "govbr",
      name: "Gov.br",
      type: "oauth",
      wellKnown: "https://sso.acesso.gov.br/.well-known/openid-configuration",
      authorization: {
        params: {
          scope: "openid email profile govbr_confiabilidades",
          response_type: "code",
        },
      },
      idToken: true,
      checks: ["pkce", "state"],
      clientId: process.env.GOVBR_CLIENT_ID,
      clientSecret: process.env.GOVBR_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub as string,
          name: (profile.name as string) || (profile.email as string),
          email: profile.email as string,
          role: "BUYER" as Role,
          kycStatus: "PENDING" as KycStatus,
        };
      },
    },
    CredentialsProvider({
      name: "credentials",
      credentials: {
        login: {
          label: "E-mail, CPF ou CNPJ",
          type: "text",
          placeholder: "E-mail, CPF ou CNPJ",
        },
        password: {
          label: "Senha",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          throw new Error("Login e senha são obrigatórios.");
        }

        const raw = credentials.login.trim();
        const digits = raw.replace(/\D/g, "");

        // Determine lookup strategy: CPF (11 digits), CNPJ (14 digits), or email
        let user: { id: string; email: string; name: string; password: string; role: Role; kycStatus: KycStatus } | null = null;

        if (digits.length === 11) {
          // CPF lookup via cpfRaw
          user = await prisma.user.findFirst({
            where: { cpfRaw: digits },
            select: { id: true, email: true, name: true, password: true, role: true, kycStatus: true },
          });
        } else if (digits.length === 14) {
          // CNPJ lookup
          user = await prisma.user.findFirst({
            where: { cnpj: digits },
            select: { id: true, email: true, name: true, password: true, role: true, kycStatus: true },
          });
        } else {
          // Email lookup
          user = await prisma.user.findUnique({
            where: { email: raw.toLowerCase() },
            select: { id: true, email: true, name: true, password: true, role: true, kycStatus: true },
          });
        }

        if (!user || !user.password) {
          throw new Error("Credenciais inválidas.");
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatch) {
          throw new Error("Credenciais inválidas.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          kycStatus: user.kycStatus,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // OAuth providers: upsert user on first sign-in
      const oauthProviders = ["govbr", "google", "apple", "github"];
      if (account && oauthProviders.includes(account.provider) && user.email) {
        const existing = await prisma.user.findUnique({ where: { email: user.email } });
        if (!existing) {
          const created = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || user.email,
              password: "",
              tipoCadastro: "PF",
              ...(account.provider === "govbr" ? { govBrSub: account.providerAccountId } : {}),
            },
          });
          user.id = created.id;
          user.role = created.role;
          user.kycStatus = created.kycStatus;
        } else {
          user.id = existing.id;
          user.role = existing.role;
          user.kycStatus = existing.kycStatus;
          if (account.provider === "govbr" && !existing.govBrSub) {
            await prisma.user.update({
              where: { id: existing.id },
              data: { govBrSub: account.providerAccountId },
            });
          }
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.kycStatus = user.kycStatus;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.kycStatus = token.kycStatus;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
