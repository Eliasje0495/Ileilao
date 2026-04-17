import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function LeiloeiroPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  if (session.user.role !== Role.LEILOEIRO && session.user.role !== Role.ADMIN) redirect("/dashboard");

  const auctions = await prisma.auction.findMany({
    where: { leiloeiroId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { lots: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Leilões</h1>
          <p className="text-gray-500 text-sm mt-1">{auctions.length} leilões criados</p>
        </div>
        <Link href="/dashboard/leiloeiro/auctions/new" className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition">
          + Novo leilão
        </Link>
      </div>

      {auctions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="text-5xl mb-4">🔨</div>
          <p className="font-semibold text-gray-700">Nenhum leilão ainda</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">Crie seu primeiro leilão e adicione lotes.</p>
          <Link href="/dashboard/leiloeiro/auctions/new" className="bg-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition">
            Criar leilão
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {auctions.map((auction) => (
            <div key={auction.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    auction.status === "LIVE" ? "bg-red-100 text-red-600" :
                    auction.status === "UPCOMING" ? "bg-blue-100 text-blue-600" :
                    auction.status === "ENDED" ? "bg-gray-100 text-gray-500" :
                    "bg-yellow-100 text-yellow-600"
                  }`}>
                    {auction.status}
                  </span>
                </div>
                <h2 className="font-bold text-gray-900">{auction.title}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {auction._count.lots} lotes ·{" "}
                  {new Date(auction.startsAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  {" – "}
                  {new Date(auction.endsAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <Link href={`/dashboard/leiloeiro/auctions/${auction.id}`} className="flex-shrink-0 text-sm font-semibold text-blue-600 border border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-50 transition">
                Gerenciar →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
