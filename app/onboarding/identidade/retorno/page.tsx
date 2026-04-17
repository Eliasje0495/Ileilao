"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function RetornoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "verified" | "pending" | "failed">("loading");

  useEffect(() => {
    if (!sessionId) { setStatus("pending"); return; }

    fetch(`/api/identity/status?session_id=${sessionId}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === "verified") setStatus("verified");
        else if (d.status === "requires_input") setStatus("failed");
        else setStatus("pending");
      })
      .catch(() => setStatus("pending"));
  }, [sessionId]);

  useEffect(() => {
    if (status === "verified") {
      const t = setTimeout(() => router.push("/dashboard"), 3000);
      return () => clearTimeout(t);
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-2xl font-black text-blue-600">i</span>
            <span className="text-2xl font-black text-gray-900">Leilão</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-10 max-w-md w-full text-center">

          {status === "loading" && (
            <>
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5 animate-pulse">
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Verificando identidade...</p>
            </>
          )}

          {status === "verified" && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Identidade verificada!</h2>
              <p className="text-sm text-gray-500 mb-6">Seu cadastro está completo. Redirecionando para o dashboard...</p>
              <Link href="/dashboard" className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition">
                Ir para o dashboard
              </Link>
            </>
          )}

          {status === "pending" && (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Verificação em análise</h2>
              <p className="text-sm text-gray-500 mb-6">Estamos analisando seus documentos. Você será notificado em breve.</p>
              <Link href="/dashboard" className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition">
                Ir para o dashboard
              </Link>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Verificação não concluída</h2>
              <p className="text-sm text-gray-500 mb-6">Não conseguimos verificar sua identidade. Tente novamente.</p>
              <Link href="/onboarding" className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition">
                Tentar novamente
              </Link>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default function RetornoPage() {
  return <Suspense><RetornoContent /></Suspense>;
}
