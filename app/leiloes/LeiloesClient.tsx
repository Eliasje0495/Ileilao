"use client";

import { useState, useTransition, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

function useFavorites() {
  const [favs, setFavs] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try { return new Set(JSON.parse(localStorage.getItem("ileilao_favs") ?? "[]")); }
    catch { return new Set(); }
  });
  const toggle = useCallback((id: string) => {
    setFavs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("ileilao_favs", JSON.stringify([...next]));
      return next;
    });
  }, []);
  return { favs, toggle };
}

const ESTADOS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

const CAT_OPTIONS = [
  { value: "", label: "Todos os tipos" },
  { value: "IMOVEL", label: "Imóveis" },
  { value: "VEICULO", label: "Veículos" },
  { value: "MAQUINA", label: "Máquinas & Agro" },
  { value: "DIVERSOS", label: "Bens Diversos" },
];

const SORT_OPTIONS = [
  { value: "date", label: "Data do Leilão" },
  { value: "price_asc", label: "Menor Valor" },
  { value: "price_desc", label: "Maior Valor" },
  { value: "discount", label: "Maior Desconto" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "LIVE", label: "Ao Vivo" },
  { value: "PUBLISHED", label: "Próximos" },
];

const CAT_ICONS: Record<string, string> = { IMOVEL: "🏠", VEICULO: "🚗", MAQUINA: "🚜", DIVERSOS: "📦" };
const CAT_LABELS: Record<string, string> = { IMOVEL: "Imóvel", VEICULO: "Veículo", MAQUINA: "Máquina", DIVERSOS: "Bem" };

interface Lot {
  id: string;
  title: string;
  category: string;
  images: string[] | null;
  startPrice: number;
  currentPrice: number;
  appraisalValue: number | null;
  status: string;
  uf: string | null;
  cidade: string | null;
  auction: {
    id: string;
    title: string;
    status: string;
    startsAt: Date;
    endsAt: Date;
    leiloeiro: { name: string };
  };
  documents: { id: string; type: string }[];
}

interface Props {
  lots: Lot[];
  initialParams: { [key: string]: string | undefined };
  catLabel: string | null;
  totalCount: number;
}

function fmtPrice(n: number) {
  return "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function LotCard({ lot, favorited, onToggleFav }: { lot: Lot; favorited: boolean; onToggleFav: (id: string) => void }) {
  const discount = lot.appraisalValue && lot.appraisalValue > lot.currentPrice
    ? Math.round((1 - lot.currentPrice / lot.appraisalValue) * 100)
    : null;
  const isLive = lot.auction.status === "LIVE";
  const icon = CAT_ICONS[lot.category] ?? "📦";
  const catLabel = CAT_LABELS[lot.category] ?? lot.category;
  const date1 = new Date(lot.auction.startsAt);
  const date2 = new Date(lot.auction.endsAt);
  const hasDocuments = lot.documents.length > 0;

  return (
    <Link href={`/lote/${lot.id}`}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col">
      {/* Image area */}
      <div className="bg-blue-50 h-40 flex items-center justify-center text-5xl relative flex-shrink-0 overflow-hidden">
        {lot.images && lot.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={lot.images[0]} alt={lot.title} className="w-full h-full object-cover" />
        ) : (
          <span className="select-none">{icon}</span>
        )}
        {discount && discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg shadow">
            -{discount}%
          </span>
        )}
        {isLive && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            VIVO
          </span>
        )}
        {hasDocuments && (
          <span className="absolute bottom-3 right-3 bg-white border border-gray-200 text-gray-600 text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            📎 {lot.documents.length}
          </span>
        )}
        <button
          onClick={e => { e.preventDefault(); onToggleFav(lot.id); }}
          className="absolute top-3 right-3 w-7 h-7 bg-white/90 hover:bg-white rounded-lg shadow flex items-center justify-center transition hover:scale-110"
          aria-label="Favoritar"
        >
          <svg className={`w-4 h-4 ${favorited ? "fill-yellow-400 stroke-yellow-400" : "fill-none stroke-gray-400"}`} viewBox="0 0 24 24" strokeWidth="2">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">{catLabel}</p>
        <p className="font-bold text-gray-900 text-sm leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
          {lot.title}
        </p>
        {(lot.cidade || lot.uf) && (
          <p className="text-xs text-gray-400 mt-0.5 mb-auto pb-2">
            📍 {[lot.cidade, lot.uf].filter(Boolean).join(" · ")}
          </p>
        )}

        {/* Auction dates */}
        <div className="space-y-1 mt-2 border-t border-gray-50 pt-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 font-medium">1º Leilão</span>
            <span className="text-gray-700 font-semibold">
              {date1.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} às {date1.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 font-medium">2º Leilão</span>
            <span className="text-gray-500">
              {date2.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} às {date2.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mt-3 border-t border-gray-50 pt-3">
          <div>
            {lot.appraisalValue && (
              <p className="text-xs text-gray-400 line-through">{fmtPrice(lot.appraisalValue)}</p>
            )}
            <p className="text-lg font-black text-blue-600">{fmtPrice(lot.currentPrice)}</p>
          </div>
          {discount && discount > 0 ? (
            <span className="text-xs bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
          ) : (
            <span className="text-xs text-gray-400">{lot.auction.leiloeiro.name.split(" ")[0]}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function LeiloesClient({ lots, initialParams, catLabel, totalCount }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();
  const [, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(false);
  const { favs, toggle: toggleFav } = useFavorites();

  // Local filter state
  const [sort, setSort] = useState(initialParams.sort ?? "date");
  const [categoria, setCategoria] = useState(initialParams.categoria ?? "");
  const [status, setStatus] = useState(initialParams.status ?? "");
  const [q, setQ] = useState(initialParams.q ?? "");
  const [minPrice, setMinPrice] = useState(initialParams.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(initialParams.maxPrice ?? "");

  function applyFilters(overrides: Record<string, string> = {}) {
    const params = new URLSearchParams(searchParamsHook.toString());
    const merged = { sort, categoria, status, q, minPrice, maxPrice, ...overrides };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v); else params.delete(k);
    });
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <>
      {/* Filter bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[180px] max-w-xs relative">
              <input value={q} onChange={e => setQ(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") applyFilters({ q }); }}
                placeholder="Buscar por palavra-chave..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 bg-white" />
              <svg className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            </div>

            {/* Category */}
            <select value={categoria} onChange={e => { setCategoria(e.target.value); applyFilters({ categoria: e.target.value }); }}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-white">
              {CAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Status */}
            <select value={status} onChange={e => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-white">
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Sort */}
            <select value={sort} onChange={e => { setSort(e.target.value); applyFilters({ sort: e.target.value }); }}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-white">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Filtros avançados toggle */}
            <button onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${showFilters ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-700 hover:border-blue-400"}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>
              Filtrar
            </button>

            <button onClick={() => applyFilters({ q })}
              className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm">
              Buscar
            </button>
          </div>

          {/* Advanced filters panel */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Estado (UF)</label>
                <select onChange={e => applyFilters({ uf: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-white">
                  <option value="">Todos os estados</option>
                  {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Preço mínimo</label>
                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="R$ 0"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Preço máximo</label>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="R$ ilimitado"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div className="flex items-end gap-2">
                <button onClick={() => applyFilters({})}
                  className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-xl text-sm hover:bg-blue-700 transition">
                  Aplicar
                </button>
                <button onClick={() => { setMinPrice(""); setMaxPrice(""); setQ(""); setCategoria(""); setStatus(""); router.push(pathname); }}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-red-300 hover:text-red-600 transition">
                  Limpar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {catLabel ? `Leilão de ${catLabel}` : "Leilões disponíveis"}
            </h1>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-blue-700">{totalCount}</span> oportunidades encontradas
            </p>
          </div>

          {/* Active filters */}
          <div className="flex flex-wrap gap-2">
            {categoria && (
              <span className="flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                {CAT_OPTIONS.find(o => o.value === categoria)?.label}
                <button onClick={() => { setCategoria(""); applyFilters({ categoria: "" }); }} className="hover:text-red-600">×</button>
              </span>
            )}
            {status && (
              <span className="flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                {STATUS_OPTIONS.find(o => o.value === status)?.label}
                <button onClick={() => { setStatus(""); applyFilters({ status: "" }); }} className="hover:text-red-600">×</button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                {minPrice ? `R$ ${Number(minPrice).toLocaleString("pt-BR")}` : "0"} – {maxPrice ? `R$ ${Number(maxPrice).toLocaleString("pt-BR")}` : "∞"}
                <button onClick={() => { setMinPrice(""); setMaxPrice(""); applyFilters({ minPrice: "", maxPrice: "" }); }} className="hover:text-red-600">×</button>
              </span>
            )}
          </div>
        </div>

        {/* Lot grid */}
        {lots.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔔</div>
            <p className="text-lg font-bold text-gray-700">Nenhum lote encontrado</p>
            <p className="text-sm text-gray-500 mt-1">Tente ajustar os filtros ou{" "}
              <Link href="/leiloes" className="text-blue-600 hover:underline">ver todos os leilões</Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {lots.map(lot => <LotCard key={lot.id} lot={lot} favorited={favs.has(lot.id)} onToggleFav={toggleFav} />)}
          </div>
        )}

        {totalCount >= 60 && (
          <div className="text-center mt-10">
            <button className="border-2 border-blue-600 text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all">
              Carregar mais
            </button>
          </div>
        )}
      </div>
    </>
  );
}
