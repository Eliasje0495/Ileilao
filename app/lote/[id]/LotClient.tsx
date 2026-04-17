"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Ably from "ably";
import { LotStatus, AuctionStatus } from "@prisma/client";
import { SiteHeader } from "@/components/SiteHeader";

interface Bid {
  id: string;
  amount: number;
  timestamp: Date;
  user: { id: string; name: string };
}

interface Lot {
  id: string;
  title: string;
  description: string | null;
  category: string;
  images: unknown;
  startPrice: number;
  currentPrice: number;
  minIncrement: number;
  appraisalValue: number | null;
  reservePrice: number | null;
  status: LotStatus;
  auction: {
    id: string;
    title: string;
    status: AuctionStatus;
    startsAt: Date;
    endsAt: Date;
    leiloeiro: { id: string; name: string };
  };
  bids: Bid[];
  documents: { id: string; type: string; url: string; hash: string }[];
}

interface Props {
  lot: Lot;
}

const DOC_LABELS: Record<string, string> = {
  EDITAL: "Edital de Venda",
  MATRICULA: "Matrícula do Imóvel",
  LAUDO: "Laudo de Avaliação",
  ATA: "Ata do Leilão",
};

const DOC_ICONS: Record<string, string> = {
  EDITAL: "📋",
  MATRICULA: "📜",
  LAUDO: "🔍",
  ATA: "✅",
};

function Countdown({ to }: { to: Date }) {
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    function tick() { setDiff(Math.max(0, new Date(to).getTime() - Date.now())); }
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [to]);

  const days = Math.floor(diff / 86400000);
  const hrs  = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  if (diff === 0) return <span className="text-sm text-gray-500">Encerrado</span>;

  return (
    <div className="flex gap-2 text-center">
      {[
        { v: days, l: "Dias" },
        { v: hrs,  l: "Horas" },
        { v: mins, l: "Min" },
        { v: secs, l: "Seg" },
      ].map(({ v, l }) => (
        <div key={l} className="bg-blue-50 rounded-xl px-3 py-2 min-w-[52px]">
          <div className="text-xl font-black text-blue-700 tabular-nums">{String(v).padStart(2, "0")}</div>
          <div className="text-xs text-blue-400 font-medium">{l}</div>
        </div>
      ))}
    </div>
  );
}

function fmt(n: number) {
  return "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

export default function LotClient({ lot: initialLot }: Props) {
  const { data: session } = useSession();
  const [lot, setLot] = useState(initialLot);
  const [bids, setBids] = useState<Bid[]>(initialLot.bids);
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState("");
  const [placing, setPlacing] = useState(false);
  const [activeTab, setActiveTab] = useState<"fotos" | "localizacao">("fotos");
  const [activeImg, setActiveImg] = useState(0);
  const images = Array.isArray(lot.images) ? (lot.images as string[]) : [];
  const [showBidHistory, setShowBidHistory] = useState(false);

  const minBid = Math.max(lot.currentPrice, lot.startPrice) + lot.minIncrement;
  const discount = lot.appraisalValue ? Math.round((1 - lot.currentPrice / lot.appraisalValue) * 100) : null;
  const isLive = lot.status === LotStatus.LIVE;
  const isSold = lot.status === LotStatus.SOLD;
  const isUpcoming = lot.status === LotStatus.PUBLISHED;

  // ── Ably real-time ──────────────────────────────────────────────────────────
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_ABLY_API_KEY;
    if (!apiKey) return;
    const client = new Ably.Realtime({ key: apiKey });
    const channel = client.channels.get(`lot:${lot.id}`);
    channel.subscribe("new-bid", (message) => {
      const data = message.data as { bidId: string; userId: string; amount: number; currentPrice: number; timestamp: string };
      setLot((prev) => ({ ...prev, currentPrice: data.currentPrice }));
      setBids((prev) => [{ id: data.bidId, amount: data.amount, timestamp: new Date(data.timestamp), user: { id: data.userId, name: "…" } }, ...prev.slice(0, 49)]);
    });
    return () => { channel.unsubscribe(); client.close(); };
  }, [lot.id]);

  // ── Place bid ───────────────────────────────────────────────────────────────
  const placeBid = useCallback(async () => {
    setBidError(""); setBidSuccess("");
    const amount = parseFloat(bidAmount.replace(",", "."));
    if (isNaN(amount)) { setBidError("Insira um valor válido."); return; }
    if (amount < minBid) { setBidError(`Lance mínimo é ${fmt(minBid)}`); return; }
    setPlacing(true);
    const res = await fetch(`/api/lots/${lot.id}/bid`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount }) });
    const data = await res.json();
    setPlacing(false);
    if (!res.ok) setBidError(data.error ?? "Erro ao registrar lance.");
    else { setBidSuccess(`Lance de ${fmt(amount)} registrado!`); setBidAmount(""); }
  }, [bidAmount, lot.id, minBid]);

  const categoryLabel = lot.category === "IMOVEL" ? "Imóvel" : lot.category === "VEICULO" ? "Veículo" : lot.category === "MAQUINA" ? "Máquina & Agro" : "Bem Diverso";
  const categoryIcon = lot.category === "IMOVEL" ? "🏠" : lot.category === "VEICULO" ? "🚗" : lot.category === "MAQUINA" ? "🚜" : "📦";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2.5 text-xs text-gray-500 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>›</span>
          <Link href="/leiloes" className="hover:text-blue-600">Leilões</Link>
          <span>›</span>
          <Link href={`/leiloes?categoria=${lot.category}`} className="hover:text-blue-600">{categoryLabel}</Link>
          <span>›</span>
          <span className="text-gray-800 font-medium line-clamp-1">{lot.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── LEFT ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Gallery tabs */}
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="flex border-b border-gray-100">
              {(["fotos", "localizacao"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-semibold transition-colors capitalize ${activeTab === tab ? "text-blue-700 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                  {tab === "fotos" ? "📸 Fotos" : "📍 Localização"}
                </button>
              ))}
            </div>
            <div className="relative h-72 bg-blue-50 overflow-hidden">
              {activeTab === "fotos" ? (
                images.length > 0 ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={images[activeImg]} alt={lot.title}
                      className="w-full h-full object-cover" />
                    {images.length > 1 && (
                      <>
                        <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition text-sm">
                          ‹
                        </button>
                        <button onClick={() => setActiveImg(i => (i + 1) % images.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition text-sm">
                          ›
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {images.map((_, i) => (
                            <button key={i} onClick={() => setActiveImg(i)}
                              className={`w-1.5 h-1.5 rounded-full transition ${i === activeImg ? "bg-white" : "bg-white/50"}`} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl select-none">
                    {categoryIcon}
                  </div>
                )
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm font-medium">
                  📍 Mapa indisponível
                </div>
              )}
              {isLive && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                  AO VIVO
                </div>
              )}
              {discount && discount > 0 && (
                <div className="absolute top-4 right-4 bg-white border border-gray-100 rounded-xl px-3 py-2 text-center shadow-sm">
                  <div className="text-xs text-gray-400">Desconto</div>
                  <div className="text-xl font-black text-red-500">-{discount}%</div>
                </div>
              )}
            </div>
            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 p-2 bg-white border-t border-gray-100 overflow-x-auto">
                {images.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt={`Foto ${i + 1}`}
                    onClick={() => setActiveImg(i)}
                    className={`w-14 h-10 object-cover rounded-lg cursor-pointer flex-shrink-0 transition ${i === activeImg ? "ring-2 ring-blue-500" : "opacity-60 hover:opacity-100"}`} />
                ))}
              </div>
            )}
          </div>

          {/* Title block */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wide">{categoryLabel}</span>
              {isSold && <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">ARREMATADO</span>}
              {isUpcoming && <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">EM BREVE</span>}
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-4">{lot.title}</h1>

            {/* Auction info row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-400 mb-0.5">Leilão</div>
                <div className="text-sm font-semibold text-gray-800 line-clamp-1">{lot.auction.title}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-400 mb-0.5">Leiloeiro</div>
                <div className="text-sm font-semibold text-gray-800">{lot.auction.leiloeiro.name}</div>
              </div>
              {lot.appraisalValue && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 mb-0.5">Avaliação</div>
                  <div className="text-sm font-semibold text-gray-800">{fmt(lot.appraisalValue)}</div>
                </div>
              )}
            </div>

            {lot.description && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2">Descrição</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{lot.description}</p>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">📎 Documentos do lote</h2>
            {lot.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lot.documents.map((doc) => (
                  <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group">
                    <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-colors">
                      {DOC_ICONS[doc.type] ?? "📄"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700">{DOC_LABELS[doc.type] ?? doc.type}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{doc.url.split("/").pop()}</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </a>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {["Edital de Venda do Imóvel", "Matrícula do Imóvel"].map(name => (
                  <div key={name} className="flex items-center gap-3 p-4 border border-dashed border-gray-200 rounded-xl text-gray-400">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl">📄</div>
                    <div>
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs text-gray-400">Documento não localizado</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
              Leia atentamente o Edital antes de dar seu lance. Dúvidas?{" "}
              <Link href="/glossario" className="text-blue-600 hover:underline">Ver glossário →</Link>
            </p>
          </div>

          {/* Payment info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-3">💳 Formas de pagamento</h2>
            <p className="text-sm text-gray-600 mb-2">À vista (obrigatório) ou parcelado conforme edital do lote.</p>
            <p className="text-xs text-gray-400">A iLeilão não oferece serviços financeiros. As formas de pagamento são operadas diretamente pelo comitente vendedor.</p>
          </div>
        </div>

        {/* ── RIGHT: Bid Panel ────────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Sticky auction panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">

            {/* Countdown */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">
                Encerra em {new Date(lot.auction.endsAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })} às{" "}
                {new Date(lot.auction.endsAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}h
              </p>
              <Countdown to={new Date(lot.auction.endsAt)} />
            </div>

            {/* 1º / 2º leilão */}
            <div className="border border-gray-100 rounded-xl overflow-hidden mb-4">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <div>
                  <span className="text-xs font-bold text-gray-500">1º Leilão</span>
                  <div className="text-xs text-gray-400">{new Date(lot.auction.startsAt).toLocaleDateString("pt-BR")} às {new Date(lot.auction.startsAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}h</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{fmt(lot.startPrice)}</div>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <span className="text-xs font-bold text-gray-500">2º Leilão</span>
                  <div className="text-xs text-gray-400">{new Date(lot.auction.endsAt).toLocaleDateString("pt-BR")} às {new Date(lot.auction.endsAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}h</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-700">{fmt(lot.currentPrice)}</div>
                  {discount && discount > 0 && (
                    <div className="text-xs text-red-500 font-semibold">-{discount}%</div>
                  )}
                </div>
              </div>
            </div>

            {/* Reserve price indicator */}
            {lot.reservePrice && (
              <div className="flex items-center gap-2 mb-4 text-xs">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${lot.currentPrice >= lot.reservePrice ? "bg-green-500" : "bg-gray-300"}`} />
                <span className="text-gray-500">
                  Leilão condicional — {lot.currentPrice >= lot.reservePrice ? "valor mínimo atingido" : "aguardando valor mínimo"}
                </span>
              </div>
            )}

            {/* Current bid */}
            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-1">Maior lance até agora</div>
              <div className="text-3xl font-black text-gray-900">{fmt(lot.currentPrice)}</div>
              <div className="text-xs text-gray-400 mt-1">+{fmt(lot.minIncrement)} incremento mínimo</div>
            </div>

            {/* CTA */}
            {isLive && session && session.user.kycStatus === "VERIFIED" ? (
              <div className="space-y-3">
                {bidError && <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">{bidError}</div>}
                {bidSuccess && <div className="p-2.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs">{bidSuccess}</div>}
                <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)}
                  placeholder={`Mín. ${fmt(minBid)}`}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <button onClick={placeBid} disabled={placing}
                  className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-60 text-sm">
                  {placing ? "Enviando..." : "Dar lance"}
                </button>
              </div>
            ) : isLive && !session ? (
              <Link href="/auth/login" className="block w-full text-center bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition text-sm">
                Entrar para participar
              </Link>
            ) : isLive && session && session.user.kycStatus !== "VERIFIED" ? (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  Complete sua verificação de identidade e deposite a caução para dar lances.
                </div>
                <Link href="/onboarding" className="block w-full text-center bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition text-sm">
                  Completar cadastro →
                </Link>
              </div>
            ) : isSold ? (
              <div className="text-center py-3.5 text-green-700 font-bold bg-green-50 rounded-xl text-sm">
                ✅ Lote arrematado
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-center py-3.5 text-gray-500 bg-gray-50 rounded-xl text-sm">
                  Lances não iniciados
                </div>
                {session && (
                  <button className="w-full border border-blue-200 text-blue-700 font-semibold py-3 rounded-xl hover:bg-blue-50 transition text-sm">
                    Solicitar participação
                  </button>
                )}
              </div>
            )}

            {/* Bid history toggle */}
            <button onClick={() => setShowBidHistory(v => !v)}
              className="w-full text-xs text-blue-600 font-medium mt-3 flex items-center justify-center gap-1 hover:underline">
              {showBidHistory ? "Ocultar" : "Ver"} histórico de lances ({bids.length})
              <svg className={`w-3 h-3 transition-transform ${showBidHistory ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </button>

            {showBidHistory && (
              <div className="mt-3 border-t border-gray-100 pt-3">
                {bids.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-3">Nenhum lance ainda</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {bids.map((bid, idx) => (
                      <div key={bid.id} className={`flex items-center justify-between py-1.5 ${idx === 0 ? "text-blue-700 font-semibold" : "text-gray-500"}`}>
                        <div>
                          <div className="text-xs">{bid.user.name.split(" ")[0]}***</div>
                          <div className="text-xs text-gray-400">{new Date(bid.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</div>
                        </div>
                        <div className={`text-xs font-bold ${idx === 0 ? "text-blue-600" : "text-gray-600"}`}>
                          {fmt(bid.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Caução CTA */}
          {isLive && session && (
            <Link href={`/lote/${lot.id}/caucao`}
              className="block w-full text-center bg-white border-2 border-blue-600 text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition text-sm">
              Depositar caução →
            </Link>
          )}
        </div>
      </div>

      {/* ── SEO text block ────────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Como participar deste leilão</h2>
          <div className="prose prose-sm text-gray-600 max-w-none">
            <ol className="space-y-2 list-decimal list-inside">
              <li>Cadastre-se na iLeilão e complete sua verificação de identidade</li>
              <li>Leia atentamente o edital e documentos disponíveis acima</li>
              <li>Solicite sua habilitação para este leilão</li>
              <li>Realize o depósito de caução (garantia) via cartão ou PIX</li>
              <li>Acesse o leilão na data e horário informados e dê seu lance</li>
            </ol>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Dúvidas sobre termos como &ldquo;1º Leilão&rdquo;, &ldquo;alienação fiduciária&rdquo; ou &ldquo;arrematação&rdquo;?{" "}
            <Link href="/glossario" className="text-blue-600 hover:underline">Acesse nosso glossário →</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
