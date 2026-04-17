"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ESTADOS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

type Tab = "localizacao" | "keyword" | "proximos" | "perto" | "direta";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "localizacao",  label: "Localização",      icon: "📍" },
  { id: "keyword",      label: "Palavra-Chave",     icon: "🔍" },
  { id: "proximos",     label: "Próximos Leilões",  icon: "📅" },
  { id: "perto",        label: "Perto de Mim",      icon: "📡" },
  { id: "direta",       label: "Venda Direta",      icon: "⚡" },
];

export function HeroSearch() {
  const router = useRouter();
  const [active, setActive] = useState<Tab>("localizacao");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [categoria, setCategoria] = useState("");
  const [keyword, setKeyword] = useState("");
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState("");

  function buildQuery(extra: Record<string, string> = {}) {
    const p = new URLSearchParams();
    if (categoria) p.set("categoria", categoria);
    if (uf) p.set("uf", uf);
    if (cidade) p.set("cidade", cidade);
    if (keyword) p.set("q", keyword);
    Object.entries(extra).forEach(([k, v]) => v && p.set(k, v));
    return `/leiloes${p.toString() ? "?" + p.toString() : ""}`;
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (active === "proximos") { router.push(buildQuery({ status: "UPCOMING" })); return; }
    if (active === "direta")   { router.push("/leiloes?tipo=direta"); return; }
    router.push(buildQuery());
  }

  function handleNearMe() {
    if (!navigator.geolocation) { setGeoError("Geolocalização não suportada neste navegador."); return; }
    setLocating(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        router.push(`/leiloes?lat=${pos.coords.latitude.toFixed(4)}&lng=${pos.coords.longitude.toFixed(4)}`);
      },
      () => {
        setLocating(false);
        setGeoError("Não foi possível obter sua localização. Verifique as permissões do navegador.");
      },
      { timeout: 8000 }
    );
  }

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
      {/* Tab bar — single connected strip */}
      <div className="flex border-b border-blue-100">
        {TABS.map((tab, i) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`flex-1 py-3 text-xs font-semibold transition-colors focus:outline-none
              ${i === 0 ? "" : "border-l border-blue-100"}
              ${active === tab.id
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-700 hover:bg-blue-50"}`}
          >
            <span className="block text-base leading-none mb-0.5">{tab.icon}</span>
            <span className="hidden sm:block">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Shared category row */}
        {active !== "proximos" && active !== "direta" && active !== "perto" && (
          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 focus:outline-none focus:border-blue-400 bg-white mb-3"
          >
            <option value="">Todas as categorias</option>
            <option value="IMOVEL">Imóveis</option>
            <option value="VEICULO">Veículos</option>
            <option value="MAQUINA">Máquinas & Agro</option>
            <option value="DIVERSOS">Bens Diversos</option>
          </select>
        )}

        {/* Localização */}
        {active === "localizacao" && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            <select value={uf} onChange={e => setUf(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 focus:outline-none focus:border-blue-400 bg-white">
              <option value="">Estado (UF)</option>
              {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input value={cidade} onChange={e => setCidade(e.target.value)}
              placeholder="Cidade"
              className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 focus:outline-none focus:border-blue-400" />
          </div>
        )}

        {/* Palavra-Chave */}
        {active === "keyword" && (
          <div className="mb-3">
            <input value={keyword} onChange={e => setKeyword(e.target.value)}
              placeholder="Ex: apartamento Copacabana, Toyota Corolla..."
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 focus:outline-none focus:border-blue-400" />
          </div>
        )}

        {/* Próximos Leilões */}
        {active === "proximos" && (
          <p className="text-sm text-gray-500 mb-3">Ver todos os leilões com data de início nos próximos dias.</p>
        )}

        {/* Perto de Mim */}
        {active === "perto" && (
          <div className="mb-3">
            <p className="text-sm text-gray-500 mb-2">Usaremos sua localização para encontrar leilões próximos a você.</p>
            {geoError && <p className="text-xs text-red-600 mb-2">{geoError}</p>}
            <button type="button" onClick={handleNearMe} disabled={locating}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm disabled:opacity-60">
              {locating ? "Localizando..." : "Usar minha localização"}
            </button>
          </div>
        )}

        {/* Venda Direta */}
        {active === "direta" && (
          <p className="text-sm text-gray-500 mb-3">Bens com possibilidade de compra direta sem necessidade de lance.</p>
        )}

        {/* Search button (not shown for "perto" since it has its own button) */}
        {active !== "perto" && (
          <button type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm">
            Buscar leilões
          </button>
        )}
      </div>
    </form>
  );
}
