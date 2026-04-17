"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function BemVindoContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") ?? "";
  const firstName = name.split(" ")[0];

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
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 w-full max-w-md p-8 text-center">

          {/* Check icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Bem vindo{firstName ? `, ${firstName}` : ""}!
          </h1>

          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Seu e-mail foi confirmado. Complete seu cadastro para poder
            participar de leilões ou continue navegando pelas oportunidades.
          </p>

          <div className="space-y-3">
            <Link href="/onboarding"
              className="block w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition">
              Complete seu cadastro
            </Link>
            <Link href="/leiloes"
              className="block w-full border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:border-blue-400 hover:text-blue-700 transition">
              Continuar navegando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BemVindoPage() {
  return (
    <Suspense>
      <BemVindoContent />
    </Suspense>
  );
}
