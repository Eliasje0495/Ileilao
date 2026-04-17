import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { KycStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const [bids, caucoes] = await Promise.all([
    prisma.bid.findMany({
      where: { userId: session.user.id, isValid: true },
      orderBy: { timestamp: "desc" },
      take: 10,
      include: { lot: { select: { id: true, title: true, currentPrice: true, status: true } } },
    }),
    prisma.caucao.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { lot: { select: { id: true, title: true } } },
    }),
  ]);

  const kycVerified = session.user.kycStatus === KycStatus.VERIFIED;
  const kycPending = session.user.kycStatus === KycStatus.PENDING;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Olá, {session.user.name.split(" ")[0]} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Bem-vindo ao seu painel iLeilão</p>
      </div>

      {/* KYC banner */}
      {!kycVerified && (
        <div className={`rounded-2xl p-5 flex items-center justify-between gap-4 ${kycPending ? "bg-amber-50 border border-amber-200" : "bg-blue-50 border border-blue-200"}`}>
          <div>
            <p className={`font-semibold text-sm ${kycPending ? "text-amber-800" : "text-blue-800"}`}>
              {kycPending ? "⏳ Verificação em andamento" : "🪪 Complete sua verificação de identidade"}
            </p>
            <p className={`text-xs mt-0.5 ${kycPending ? "text-amber-600" : "text-blue-600"}`}>
              {kycPending ? "Aguarde a aprovação para dar lances." : "É obrigatório para participar de leilões."}
            </p>
          </div>
          {!kycPending && (
            <Link href="/dashboard/kyc" className="flex-shrink-0 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition">
              Verificar agora
            </Link>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total de lances", value: bids.length },
          { label: "Caução ativa", value: caucoes.filter(c => c.status === "HELD").length },
          { label: "Status KYC", value: session.user.kycStatus },
          { label: "Papel", value: session.user.role },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
            <div className="text-xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent bids */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Meus lances recentes</h2>
        {bids.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">Você ainda não deu nenhum lance.</p>
        ) : (
          <div className="space-y-3">
            {bids.map((bid) => (
              <div key={bid.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <Link href={`/lote/${bid.lot.id}`} className="text-sm font-medium text-gray-800 hover:text-blue-600 line-clamp-1">
                    {bid.lot.title}
                  </Link>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(bid.timestamp).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div className="text-sm font-bold text-blue-600">
                  R$ {Number(bid.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Caucoes */}
      {caucoes.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Minhas cauções</h2>
          <div className="space-y-3">
            {caucoes.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <Link href={`/lote/${c.lot.id}`} className="text-sm font-medium text-gray-800 hover:text-blue-600">
                    {c.lot.title}
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-700">
                    R$ {Number(c.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    c.status === "HELD" ? "bg-green-100 text-green-700" :
                    c.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                    c.status === "RELEASED" ? "bg-gray-100 text-gray-500" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
