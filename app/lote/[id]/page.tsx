import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import LotClient from "./LotClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const lot = await prisma.lot.findUnique({
    where: { id },
    select: { title: true, description: true, category: true, currentPrice: true, auction: { select: { startsAt: true } } },
  });
  if (!lot) return { title: "Lote — iLeilão" };
  const categoryMap: Record<string, string> = { IMOVEL: "Imóvel", VEICULO: "Veículo", MAQUINA: "Máquina", DIVERSOS: "Bem" };
  const cat = categoryMap[lot.category] ?? lot.category;
  const price = Number(lot.currentPrice).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  const date = lot.auction ? new Date(lot.auction.startsAt).toLocaleDateString("pt-BR") : "";
  return {
    title: `Leilão de ${cat} — ${lot.title} | iLeilão`,
    description: lot.description
      ? `${lot.description.slice(0, 140)} — Lance inicial R$ ${price}. Leilão em ${date}. Acesse a iLeilão.`
      : `Leilão de ${cat.toLowerCase()}: ${lot.title}. Lance inicial R$ ${price}. Data: ${date}. Adquira com desconto na iLeilão.`,
    openGraph: {
      title: `${lot.title} | iLeilão`,
      description: `Lance inicial R$ ${price} · Leilão em ${date}`,
    },
  };
}

export default async function LotePage({ params }: Props) {
  const { id } = await params;

  const lot = await prisma.lot.findUnique({
    where: { id },
    include: {
      auction: {
        select: {
          id: true,
          title: true,
          status: true,
          startsAt: true,
          endsAt: true,
          leiloeiro: { select: { id: true, name: true } },
        },
      },
      bids: {
        where: { isValid: true },
        orderBy: { timestamp: "desc" },
        take: 20,
        select: {
          id: true,
          amount: true,
          timestamp: true,
          user: { select: { id: true, name: true } },
        },
      },
      documents: {
        select: { id: true, type: true, url: true, hash: true },
      },
    },
  });

  if (!lot) notFound();

  // Serialize Decimal → number for client
  const serialized = {
    ...lot,
    startPrice: Number(lot.startPrice),
    currentPrice: Number(lot.currentPrice),
    minIncrement: Number(lot.minIncrement),
    appraisalValue: lot.appraisalValue ? Number(lot.appraisalValue) : null,
    reservePrice: lot.reservePrice ? Number(lot.reservePrice) : null,
    bids: lot.bids.map((b) => ({
      ...b,
      amount: Number(b.amount),
    })),
  };

  return <LotClient lot={serialized} />;
}
