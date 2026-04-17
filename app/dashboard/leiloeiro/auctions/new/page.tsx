"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewAuctionPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", description: "", startsAt: "", endsAt: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auctions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error ?? "Erro ao criar leilão."); return; }
    router.push(`/dashboard/leiloeiro/auctions/${data.auction.id}`);
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/leiloeiro" className="text-sm text-gray-500 hover:text-blue-600">← Voltar</Link>
        <h1 className="text-2xl font-bold text-gray-900">Novo leilão</h1>
      </div>

      {error && <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
          <input required value={form.title} onChange={e => set("title", e.target.value)}
            placeholder="Ex: 1º Leilão Extrajudicial de Imóveis SP"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea rows={3} value={form.description} onChange={e => set("description", e.target.value)}
            placeholder="Descrição do leilão (opcional)"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de início *</label>
            <input required type="datetime-local" value={form.startsAt} onChange={e => set("startsAt", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de encerramento *</label>
            <input required type="datetime-local" value={form.endsAt} onChange={e => set("endsAt", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
          {loading ? "Criando..." : "Criar leilão"}
        </button>
      </form>
    </div>
  );
}
