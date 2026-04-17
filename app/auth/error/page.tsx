"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "Erro de configuração do servidor. Contacte o suporte.",
  AccessDenied: "Acesso negado. Você não tem permissão para entrar.",
  Verification: "O link de verificação expirou ou já foi usado. Solicite um novo.",
  OAuthSignin: "Erro ao iniciar login social. Tente novamente.",
  OAuthCallback: "Erro no retorno do login social. Tente novamente.",
  OAuthCreateAccount: "Não foi possível criar a conta. Tente com outro método.",
  EmailCreateAccount: "Não foi possível criar a conta com esse e-mail.",
  Callback: "Erro no processo de autenticação.",
  OAuthAccountNotLinked: "Este e-mail já está cadastrado com outro método de login.",
  SessionRequired: "Você precisa estar logado para acessar essa página.",
  Default: "Ocorreu um erro durante a autenticação.",
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") ?? "Default";
  const message = ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.Default;

  return (
    <div className="text-center">
      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4M12 16h.01" strokeLinecap="round"/>
        </svg>
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">Erro de autenticação</h1>
      <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">{message}</p>
      {errorCode && (
        <p className="text-xs text-gray-300 mb-4 font-mono">código: {errorCode}</p>
      )}
      <div className="flex flex-col gap-2">
        <Link href="/auth/login"
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm">
          Tentar novamente
        </Link>
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition">
          Voltar para a home
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-2xl font-black text-blue-600 tracking-tight">i</span>
            <span className="text-2xl font-black text-gray-900 tracking-tight">Leilão</span>
          </Link>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 w-full max-w-md p-8">
          <Suspense><ErrorContent /></Suspense>
        </div>
      </div>
    </div>
  );
}
