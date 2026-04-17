"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("As senhas não coincidem."); return; }
    if (password.length < 6) { setError("Mínimo 6 caracteres."); return; }
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/auth/login?reset=1");
    } else {
      const data = await res.json();
      setError(data.error ?? "Link inválido ou expirado.");
    }
  }

  if (!token) return (
    <div className="text-center">
      <p className="text-sm text-red-600 mb-4">Link inválido ou expirado.</p>
      <Link href="/auth/forgot-password" className="text-blue-600 hover:underline text-sm">Solicitar novo link</Link>
    </div>
  );

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Nova senha</h1>
      <p className="text-sm text-gray-500 mb-6">Crie uma nova senha para sua conta.</p>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
          <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
            placeholder="Repita a senha"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
          {loading ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
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
          <Suspense><ResetForm /></Suspense>
        </div>
      </div>
    </div>
  );
}
