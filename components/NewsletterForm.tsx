"use client";

import { useState } from "react";
import Link from "next/link";

const ESTADOS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [uf, setUf] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, uf: uf || null }),
    });
    setLoading(false);
    if (!res.ok) { setError("Erro ao cadastrar. Tente novamente."); return; }
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-center py-4">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-bold text-gray-900">Cadastrado com sucesso!</p>
        <p className="text-sm text-gray-500 mt-1">Você receberá as melhores oportunidades em breve.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
      <input
        type="email" required value={email} onChange={e => setEmail(e.target.value)}
        placeholder="Seu melhor e-mail"
        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400"
      />
      <select value={uf} onChange={e => setUf(e.target.value)}
        className="px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-white">
        <option value="">Estado (UF)</option>
        {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
      </select>
      <button type="submit" disabled={loading}
        className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm flex-shrink-0 disabled:opacity-60">
        {loading ? "..." : "Enviar"}
      </button>
      {error && <p className="text-xs text-red-600 mt-1 w-full text-center">{error}</p>}
    </form>
  );
}
