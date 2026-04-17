import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AuctionStatus, LotStatus, LotCategory } from "@prisma/client";
import { SiteHeader } from "@/components/SiteHeader";
import LeiloesClient from "./LeiloesClient";

export const dynamic = "force-dynamic";

interface SearchParams {
  categoria?: string;
  status?: string;
  uf?: string;
  minPrice?: string;
  maxPrice?: string;
  minDiscount?: string;
  sort?: string;
  q?: string;
  tipo?: string;
  condicao?: string;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
  const p = await searchParams;
  const catMap: Record<string, string> = { IMOVEL: "Imóveis", VEICULO: "Veículos", MAQUINA: "Máquinas", DIVERSOS: "Bens Diversos" };
  const cat = p.categoria ? catMap[p.categoria] ?? p.categoria : null;
  const uf = p.uf ?? null;

  const title = cat
    ? `Leilão de ${cat}${uf ? ` em ${uf}` : ""} Online | iLeilão`
    : uf
    ? `Leilões Online em ${uf} | iLeilão`
    : "Leilões de Imóveis, Veículos e Bens Online | iLeilão";

  const desc = cat
    ? `Encontre ${cat.toLowerCase()} em leilão${uf ? ` no ${uf}` : " em todo o Brasil"} com até 80% de desconto. Leilões judiciais e extrajudiciais na iLeilão.`
    : `Imóveis, veículos e bens em leilão online em todo o Brasil com até 80% de desconto. Leilões judiciais e extrajudiciais na iLeilão.`;

  return {
    title,
    description: desc,
    alternates: { canonical: "https://ileilao.com/leiloes" },
    openGraph: { title, description: desc },
  };
}

export default async function LeiloesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const p = await searchParams;

  const categoryFilter = p.categoria as LotCategory | undefined;
  const statusFilter = p.status as LotStatus | undefined;
  const minPrice = p.minPrice ? parseFloat(p.minPrice) : undefined;
  const maxPrice = p.maxPrice ? parseFloat(p.maxPrice) : undefined;

  const lots = await prisma.lot.findMany({
    where: {
      ...(categoryFilter ? { category: categoryFilter } : {}),
      ...(statusFilter ? { status: statusFilter } : { status: { in: [LotStatus.PUBLISHED, LotStatus.LIVE] } }),
      ...(minPrice !== undefined ? { currentPrice: { gte: minPrice } } : {}),
      ...(maxPrice !== undefined ? { currentPrice: { lte: maxPrice } } : {}),
      ...(p.q ? { title: { contains: p.q, mode: "insensitive" } } : {}),
      auction: { status: { in: [AuctionStatus.UPCOMING, AuctionStatus.LIVE] } },
    },
    include: {
      auction: {
        select: {
          id: true,
          title: true,
          status: true,
          startsAt: true,
          endsAt: true,
          leiloeiro: { select: { name: true } },
        },
      },
      documents: { select: { id: true, type: true }, take: 3 },
    },
    orderBy: p.sort === "price_asc"
      ? { currentPrice: "asc" }
      : p.sort === "price_desc"
      ? { currentPrice: "desc" }
      : { auction: { startsAt: "asc" } },
    take: 60,
  });

  // Serialize Decimals
  const serialized = lots.map(lot => ({
    ...lot,
    startPrice: Number(lot.startPrice),
    currentPrice: Number(lot.currentPrice),
    minIncrement: Number(lot.minIncrement),
    appraisalValue: lot.appraisalValue ? Number(lot.appraisalValue) : null,
    reservePrice: lot.reservePrice ? Number(lot.reservePrice) : null,
  }));

  const catMap: Record<string, string> = { IMOVEL: "Imóveis", VEICULO: "Veículos", MAQUINA: "Máquinas & Agro", DIVERSOS: "Bens Diversos" };
  const catLabel = categoryFilter ? catMap[categoryFilter] : null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SiteHeader />
      <LeiloesClient
        lots={serialized}
        initialParams={p as { [key: string]: string | undefined }}
        catLabel={catLabel}
        totalCount={serialized.length}
      />

      {/* SEO text block */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {catLabel ? `Leilão de ${catLabel} Online` : "Leilão de Imóveis Online — iLeilão"}
          </h2>
          <div className="prose prose-sm text-gray-600 max-w-none grid md:grid-cols-2 gap-6">
            <div>
              <p>A iLeilão é a plataforma brasileira de leilões online mais completa, com imóveis, veículos, máquinas e bens diversos com <strong>até 80% de desconto</strong> em relação ao valor de avaliação.</p>
              <p className="mt-2">Participar é simples: cadastre-se, leia o edital, deposite a caução e dê seu lance. Todo o processo é 100% digital, com segurança jurídica garantida pelo Decreto 21.981/1932.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Como participar do leilão online iLeilão</h3>
              <ol className="space-y-1 list-decimal list-inside text-sm">
                <li>Cadastre-se na iLeilão e complete seu KYC digital</li>
                <li>Veja os lotes disponíveis e leia o edital</li>
                <li>Solicite sua habilitação e deposite a caução</li>
                <li>Participe online e dê seu lance em tempo real</li>
                <li>Em caso de arremate, receba as instruções por e-mail</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
