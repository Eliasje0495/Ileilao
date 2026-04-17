import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { KycStatus, LotStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  return "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const userId = session.user.id;

  // All lots where user has valid bids — with their highest bid and lot details
  const bidGroups = await prisma.bid.groupBy({
    by: ["lotId"],
    where: { userId, isValid: true },
    _max: { amount: true },
    _count: { id: true },
  });

  const lotIds = bidGroups.map(b => b.lotId);

  const [lots, caucoes, wonCount] = await Promise.all([
    prisma.lot.findMany({
      where: { id: { in: lotIds } },
      select: {
        id: true, title: true, currentPrice: true, status: true,
        images: true, category: true,
        auction: { select: { endsAt: true, title: true } },
        winnerId: true,
      },
      orderBy: { auction: { endsAt: "asc" } },
    }),
    prisma.caucao.findMany({
      where: { userId },
      select: { lotId: true, status: true, amount: true },
    }),
    prisma.lot.count({ where: { winnerId: userId, status: LotStatus.SOLD } }),
  ]);

  const kycVerified = session.user.kycStatus === KycStatus.VERIFIED;
  const kycPending  = session.user.kycStatus === KycStatus.PENDING;

  // Build per-lot data
  const activeLots = lots
    .filter(l => l.status !== LotStatus.SOLD && l.status !== LotStatus.WITHDRAWN)
    .map(l => {
      const group    = bidGroups.find(b => b.lotId === l.id)!;
      const myBest   = Number(group._max.amount ?? 0);
      const current  = Number(l.currentPrice);
      const leading  = myBest >= current;
      const caução   = caucoes.find(c => c.lotId === l.id);
      const img      = Array.isArray(l.images) ? (l.images as string[])[0] : null;
      return { ...l, myBest, current, leading, caução, img, bidCount: group._count.id };
    });

  const wonLots = lots.filter(l => l.status === LotStatus.SOLD && l.winnerId === userId);

  const totalCaucao = caucoes
    .filter(c => c.status === "HELD")
    .reduce((s, c) => s + Number(c.amount), 0);

  const stats = [
    { label: "Lances dados",     value: bidGroups.reduce((s, b) => s + b._count.id, 0), color: "text-gray-900" },
    { label: "Lotes em disputa", value: activeLots.length,                               color: "text-blue-700" },
    { label: "Lotes arrematados",value: wonCount,                                        color: "text-green-700" },
    { label: "Caução retida",    value: fmt(totalCaucao),                                color: "text-amber-700" },
  ];

  return (
    <div className="space-y-8">

      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Olá, {session.user.name.split(" ")[0]} 👋</h1>
          <p className="text-gray-400 text-sm mt-0.5">Aqui está um resumo da sua atividade</p>
        </div>
        <Link href="/leiloes"
          className="text-sm font-semibold bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition hidden md:block">
          Explorar leilões →
        </Link>
      </div>

      {/* KYC banner */}
      {!kycVerified && (
        <div className={`rounded-2xl p-4 flex items-center justify-between gap-4
          ${kycPending ? "bg-amber-50 border border-amber-200" : "bg-blue-50 border border-blue-200"}`}>
          <div>
            <p className={`font-semibold text-sm ${kycPending ? "text-amber-800" : "text-blue-800"}`}>
              {kycPending ? "⏳ Verificação em andamento — aguarde a aprovação" : "🪪 Verifique sua identidade para dar lances"}
            </p>
            <p className={`text-xs mt-0.5 ${kycPending ? "text-amber-600" : "text-blue-600"}`}>
              {kycPending ? "Nossa equipe está revisando seus documentos." : "É obrigatório completar o KYC para participar de leilões."}
            </p>
          </div>
          {!kycPending && (
            <Link href="/dashboard/kyc"
              className="flex-shrink-0 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition">
              Verificar agora
            </Link>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="text-xs text-gray-400 mb-1">{s.label}</div>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Active lots / lances */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Meus lances ativos</h2>
          <span className="text-xs text-gray-400">{activeLots.length} lote{activeLots.length !== 1 ? "s" : ""}</span>
        </div>

        {activeLots.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-12 text-center">
            <p className="text-2xl mb-2">🔨</p>
            <p className="text-sm font-medium text-gray-600 mb-1">Você ainda não deu nenhum lance</p>
            <p className="text-xs text-gray-400 mb-4">Explore os leilões disponíveis e participe!</p>
            <Link href="/leiloes" className="text-sm font-semibold text-blue-600 hover:underline">Ver leilões disponíveis →</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {activeLots.map(lot => (
              <Link key={lot.id} href={`/lote/${lot.id}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-blue-200 transition-all group flex">
                {/* Image */}
                <div className="w-28 flex-shrink-0 bg-blue-50 relative overflow-hidden">
                  {lot.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={lot.img} alt={lot.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      {lot.category === "IMOVEL" ? "🏠" : lot.category === "VEICULO" ? "🚗" : lot.category === "MAQUINA" ? "🚜" : "📦"}
                    </div>
                  )}
                  {lot.leading ? (
                    <div className="absolute top-2 left-0 right-0 flex justify-center">
                      <span className="bg-green-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">NA FRENTE</span>
                    </div>
                  ) : (
                    <div className="absolute top-2 left-0 right-0 flex justify-center">
                      <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">SUPERADO</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-4 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-700 mb-2">{lot.title}</p>

                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <p className="text-[10px] text-gray-400">Meu lance</p>
                      <p className="text-base font-black text-gray-900">{fmt(lot.myBest)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">Lance atual</p>
                      <p className={`text-base font-black ${lot.leading ? "text-green-600" : "text-red-500"}`}>{fmt(lot.current)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">
                      Encerra {new Date(lot.auction.endsAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                    </span>
                    {lot.caução?.status !== "HELD" && (
                      <span className="text-[10px] text-amber-600 font-semibold">⚠ Caução pendente</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Won lots */}
      {wonLots.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-4">Lotes arrematados 🏆</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {wonLots.map(lot => {
              const img = Array.isArray(lot.images) ? (lot.images as string[])[0] : null;
              return (
                <Link key={lot.id} href={`/lote/${lot.id}`}
                  className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden hover:shadow-md transition-all group flex">
                  <div className="w-28 flex-shrink-0 bg-green-50 relative overflow-hidden">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={lot.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🏆</div>
                    )}
                  </div>
                  <div className="flex-1 p-4 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-green-700 mb-2">{lot.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">✅ Arrematado</span>
                      <span className="text-xs font-bold text-gray-700">{fmt(Number(lot.currentPrice))}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Cauções */}
      {caucoes.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Minhas cauções</h2>
          <div className="space-y-2">
            {caucoes.map(c => {
              const lot = lots.find(l => l.id === c.lotId);
              return (
                <div key={c.lotId} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700 truncate max-w-[60%]">{lot?.title ?? c.lotId}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-800">{fmt(Number(c.amount))}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      c.status === "HELD"     ? "bg-green-100 text-green-700" :
                      c.status === "PENDING"  ? "bg-amber-100 text-amber-700" :
                      c.status === "RELEASED" ? "bg-gray-100 text-gray-500" :
                                                "bg-red-100 text-red-700"
                    }`}>{c.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Explorar leilões", href: "/leiloes",          icon: "🔍" },
          { label: "KYC / Identidade", href: "/dashboard/kyc",    icon: "🪪" },
          { label: "Auditório ao vivo",href: "/dashboard/auditorio", icon: "📡" },
          { label: "Fale conosco",     href: "/contato",          icon: "💬" },
        ].map(a => (
          <Link key={a.href} href={a.href}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-center hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm">
            <div className="text-2xl mb-1">{a.icon}</div>
            <div className="text-xs font-semibold text-gray-700">{a.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
