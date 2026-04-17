"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Ably from "ably";

interface LiveLot {
  id: string;
  lotNumber: string;
  title: string;
  description: string | null;
  category: string;
  images: string[];
  startPrice: number;
  currentPrice: number;
  minIncrement: number;
  appraisalValue: number | null;
  bidCount: number;
  auctionId: string;
  auctionTitle: string;
  endsAt: string;
  sellerName: string;
  isMyBid: boolean;
}

interface Props {
  lots: LiveLot[];
  userName: string;
  ablyKey: string;
}

// ── Countdown ─────────────────────────────────────────────────────────────────
function Countdown({ endsAt }: { endsAt: string }) {
  const [secs, setSecs] = useState(() =>
    Math.max(0, Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setSecs((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const fmt = (n: number) => String(n).padStart(2, "0");

  return (
    <span className={`font-mono text-sm font-semibold tabular-nums ${secs < 300 ? "text-red-600" : "text-gray-700"}`}>
      {fmt(h)}:{fmt(m)}:{fmt(s)}
    </span>
  );
}

// ── Lot Card ──────────────────────────────────────────────────────────────────
function LotCard({
  lot,
  favorited,
  onToggleFav,
}: {
  lot: LiveLot;
  favorited: boolean;
  onToggleFav: (id: string) => void;
}) {
  const router = useRouter();
  const img = lot.images?.[0] ?? null;

  const discount =
    lot.appraisalValue && lot.appraisalValue > lot.currentPrice
      ? Math.round(((lot.appraisalValue - lot.currentPrice) / lot.appraisalValue) * 100)
      : null;

  // Derive city / neighborhood from title (fallback to full title)
  const titleParts = lot.title.split(" - ");
  const location = titleParts[0] ?? lot.title;
  const street = titleParts[1] ?? "";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
      {/* Header: lot number + countdown */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <span className="text-base font-bold text-gray-900">{lot.lotNumber}</span>
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <Countdown endsAt={lot.endsAt} />
        </div>
      </div>

      {/* Image */}
      <div className="relative mx-3 rounded-xl overflow-hidden bg-gray-100" style={{ height: 172 }}>
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={lot.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
              <path d="M21 15l-5-5L5 21" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {/* Desocupado badge */}
        <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
          Desocupado
        </span>
        {/* Favorite */}
        <button
          onClick={() => onToggleFav(lot.id)}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center hover:scale-110 transition-transform"
        >
          <svg
            className={`w-4 h-4 ${favorited ? "fill-yellow-400 stroke-yellow-400" : "fill-none stroke-gray-400"}`}
            viewBox="0 0 24 24" strokeWidth="2"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </button>
      </div>

      {/* Location */}
      <div className="px-3 pt-3 pb-1">
        <div className="flex items-start gap-1.5">
          <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-blue-600 truncate">{location}</p>
            {street && <p className="text-[11px] text-gray-400 truncate">{street}</p>}
          </div>
        </div>
      </div>

      <div className="mx-3 border-t border-gray-100 my-2" />

      {/* Seller */}
      <p className="text-xs font-semibold text-gray-700 text-center px-3 truncate">{lot.sellerName}</p>

      {/* Price info */}
      <div className="px-3 pt-2 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Lance mínimo:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-gray-900">
              R$ {lot.currentPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
            {discount !== null && (
              <span className="flex items-center gap-0.5 text-green-600 text-xs font-bold">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {discount}%
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <span>Incremento: R$ {lot.minIncrement.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          <span>Lances: {lot.bidCount}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="p-3 mt-auto pt-3">
        <button
          onClick={() => router.push(`/lote/${lot.id}`)}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition text-sm"
        >
          Enviar lance
        </button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
type Tab = "vivo" | "meus" | "favoritos";

export function AuditorioClient({ lots: initialLots, userName, ablyKey }: Props) {
  const [tab, setTab] = useState<Tab>("vivo");
  const [lots, setLots] = useState(initialLots);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const saved = localStorage.getItem("ileilao_favs");
      return new Set(saved ? JSON.parse(saved) : []);
    } catch { return new Set(); }
  });

  // Ably real-time price updates
  useEffect(() => {
    if (!ablyKey || lots.length === 0) return;
    const client = new Ably.Realtime({ key: ablyKey });

    const channels = lots.map((lot) => {
      const ch = client.channels.get(`lot:${lot.id}`);
      ch.subscribe("bid", (msg) => {
        setLots((prev) =>
          prev.map((l) =>
            l.id === lot.id
              ? { ...l, currentPrice: msg.data.amount, bidCount: l.bidCount + 1 }
              : l
          )
        );
      });
      return ch;
    });

    return () => {
      channels.forEach((ch) => ch.unsubscribe());
      client.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ablyKey]);

  const toggleFav = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("ileilao_favs", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const displayedLots = lots.filter((lot) => {
    if (tab === "meus") return lot.isMyBid;
    if (tab === "favoritos") return favorites.has(lot.id);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <TabButton active={tab === "vivo"} onClick={() => setTab("vivo")}>
          <span className="flex items-center gap-2">
            <LiveIcon />
            Leilões ao vivo
          </span>
        </TabButton>
        <TabButton active={tab === "meus"} onClick={() => setTab("meus")}>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Meus leilões
          </span>
        </TabButton>
        <TabButton active={tab === "favoritos"} onClick={() => setTab("favoritos")}>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            Leilões favoritos
          </span>
        </TabButton>
      </div>

      {/* Section header */}
      <div className="text-center">
        <h1 className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900">
          <LiveIcon className="text-red-500" />
          {tab === "vivo" && "Leilões ao vivo"}
          {tab === "meus" && "Meus leilões"}
          {tab === "favoritos" && "Leilões favoritos"}
        </h1>
        <p className="text-sm text-gray-500 mt-1 max-w-xl mx-auto">
          {tab === "vivo" && (
            <>
              Descubra os leilões de hoje e não se esqueça de habilitar-se para participar.{" "}
              Confira nossa <Link href="/leiloes/agenda" className="text-blue-600 hover:underline">Agenda</Link> ou os{" "}
              <Link href="/leiloes?status=ENDED" className="text-blue-600 hover:underline">Leilões Encerrados</Link>.
            </>
          )}
          {tab === "meus" && "Lotes em que você já deu lances e ainda estão ao vivo."}
          {tab === "favoritos" && "Lotes que você marcou como favorito."}
        </p>
      </div>

      {/* Grid */}
      {displayedLots.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">
            {tab === "vivo" ? "📡" : tab === "meus" ? "🔨" : "⭐"}
          </div>
          <p className="text-sm font-medium text-gray-500">
            {tab === "vivo" && "Nenhum leilão ao vivo no momento."}
            {tab === "meus" && "Você ainda não participou de nenhum leilão ao vivo."}
            {tab === "favoritos" && "Você ainda não favoritou nenhum lote."}
          </p>
          {tab === "vivo" && (
            <Link href="/leiloes/agenda" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
              Ver agenda de próximos leilões →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedLots.map((lot) => (
            <LotCard
              key={lot.id}
              lot={lot}
              favorited={favorites.has(lot.id)}
              onToggleFav={toggleFav}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
        active
          ? "bg-blue-100 text-blue-800 border border-blue-200"
          : "bg-blue-700 text-white hover:bg-blue-800"
      }`}
    >
      {children}
    </button>
  );
}

function LiveIcon({ className = "text-blue-600" }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path d="M8.5 8.5a5 5 0 000 7M15.5 8.5a5 5 0 010 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M5.5 5.5a9 9 0 000 13M18.5 5.5a9 9 0 010 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".5"/>
    </svg>
  );
}
