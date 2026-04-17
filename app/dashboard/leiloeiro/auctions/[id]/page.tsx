"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Lot {
  id: string; title: string; category: string;
  startPrice: number; currentPrice: number; status: string;
}

interface Auction {
  id: string; title: string; description: string | null;
  status: string; startsAt: string; endsAt: string;
  lots: Lot[];
}

const CATEGORIES = ["IMOVEL", "VEICULO", "MAQUINA", "DIVERSOS"];

export default function ManageAuctionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [showLotForm, setShowLotForm] = useState(false);
  const [lot, setLot] = useState({ title: "", description: "", category: "IMOVEL", startPrice: "", minIncrement: "", appraisalValue: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/auctions/${id}`).then(r => r.json()).then(d => setAuction(d.auction));
  }, [id]);

  function setL(field: string, value: string) { setLot(f => ({ ...f, [field]: value })); }

  async function addLot(e: React.FormEvent) {
    e.preventDefault(); setError(""); setSaving(true);
    const res = await fetch("/api/lots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lot, auctionId: id, startPrice: parseFloat(lot.startPrice), minIncrement: parseFloat(lot.minIncrement), appraisalValue: lot.appraisalValue ? parseFloat(lot.appraisalValue) : null }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Erro ao adicionar lote."); return; }
    setAuction(a => a ? { ...a, lots: [...a.lots, data.lot] } : a);
    setShowLotForm(false);
    setLot({ title: "", description: "", category: "IMOVEL", startPrice: "", minIncrement: "", appraisalValue: "" });
  }

  async function publishAuction() {
    const res = await fetch(`/api/auctions/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "UPCOMING" }) });
    const data = await res.json();
    if (res.ok) setAuction(a => a ? { ...a, status: data.auction.status } : a);
  }

  async function publishLot(lotId: string) {
    const res = await fetch(`/api/lots/${lotId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "PUBLISHED" }) });
    const data = await res.json();
    if (res.ok) setAuction(a => a ? { ...a, lots: a.lots.map(l => l.id === lotId ? { ...l, status: data.lot.status } : l) } : a);
  }

  if (!auction) return <div className="text-gray-400 py-12 text-center">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/leiloeiro" className="text-sm text-gray-500 hover:text-blue-600">← Voltar</Link>
        <h1 className="text-2xl font-bold text-gray-900 flex-1">{auction.title}</h1>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          auction.status === "LIVE" ? "bg-red-100 text-red-600" :
          auction.status === "UPCOMING" ? "bg-blue-100 text-blue-600" :
          "bg-gray-100 text-gray-500"}`}>{auction.status}</span>
        {auction.status === "DRAFT" && (
          <button onClick={publishAuction} className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition">
            Publicar leilão
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-xs text-gray-400 mb-1">Início</div>
          <div className="font-semibold text-gray-800">{new Date(auction.startsAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-xs text-gray-400 mb-1">Encerramento</div>
          <div className="font-semibold text-gray-800">{new Date(auction.endsAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-xs text-gray-400 mb-1">Lotes</div>
          <div className="font-bold text-gray-900">{auction.lots.length}</div>
        </div>
      </div>

      {/* Lots */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-800">Lotes</h2>
          <button onClick={() => setShowLotForm(v => !v)} className="text-sm font-semibold text-blue-600 border border-blue-200 px-4 py-1.5 rounded-xl hover:bg-blue-50 transition">
            {showLotForm ? "Cancelar" : "+ Adicionar lote"}
          </button>
        </div>

        {showLotForm && (
          <form onSubmit={addLot} className="bg-blue-50 rounded-xl p-5 mb-5 space-y-4">
            {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Título *</label>
                <input required value={lot.title} onChange={e => setL("title", e.target.value)} placeholder="Ex: Apartamento 3 quartos, SP"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Descrição</label>
                <textarea rows={2} value={lot.description} onChange={e => setL("description", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Categoria *</label>
                <select required value={lot.category} onChange={e => setL("category", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Preço inicial (R$) *</label>
                <input required type="number" min="0" step="0.01" value={lot.startPrice} onChange={e => setL("startPrice", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Incremento mínimo (R$) *</label>
                <input required type="number" min="0" step="0.01" value={lot.minIncrement} onChange={e => setL("minIncrement", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Valor de avaliação (R$)</label>
                <input type="number" min="0" step="0.01" value={lot.appraisalValue} onChange={e => setL("appraisalValue", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <button type="submit" disabled={saving} className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
              {saving ? "Salvando..." : "Adicionar lote"}
            </button>
          </form>
        )}

        {auction.lots.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Nenhum lote adicionado ainda.</p>
        ) : (
          <div className="space-y-3">
            {auction.lots.map(l => (
              <div key={l.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-800">{l.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{l.category} · R$ {Number(l.startPrice).toLocaleString("pt-BR")}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${l.status === "PUBLISHED" || l.status === "LIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {l.status}
                  </span>
                  {l.status === "DRAFT" && (
                    <button onClick={() => publishLot(l.id)} className="text-xs text-blue-600 hover:underline">Publicar</button>
                  )}
                  <Link href={`/lote/${l.id}`} className="text-xs text-gray-500 hover:text-blue-600">Ver →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
