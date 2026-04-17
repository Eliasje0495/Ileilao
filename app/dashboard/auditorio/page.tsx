import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AuditorioClient } from "./AuditorioClient";

export const dynamic = "force-dynamic";

export default async function AuditorioPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  // All LIVE lots with auction info + bid count
  const liveLots = await prisma.lot.findMany({
    where: { status: "LIVE" },
    include: {
      auction: {
        select: { id: true, title: true, endsAt: true, leiloeiro: { select: { name: true } } },
      },
      _count: { select: { bids: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Lots where this user has placed a bid (and are still LIVE)
  const myBidLotIds = await prisma.bid.findMany({
    where: { userId: session.user.id, lot: { status: "LIVE" } },
    select: { lotId: true },
    distinct: ["lotId"],
  });
  const myBidIds = new Set(myBidLotIds.map((b) => b.lotId));

  const serialized = liveLots.map((lot, idx) => ({
    id: lot.id,
    lotNumber: String(idx + 1).padStart(3, "0"),
    title: lot.title,
    description: lot.description,
    category: lot.category,
    images: lot.images as string[],
    startPrice: Number(lot.startPrice),
    currentPrice: Number(lot.currentPrice),
    minIncrement: Number(lot.minIncrement),
    appraisalValue: lot.appraisalValue ? Number(lot.appraisalValue) : null,
    bidCount: lot._count.bids,
    auctionId: lot.auction.id,
    auctionTitle: lot.auction.title,
    endsAt: lot.auction.endsAt.toISOString(),
    sellerName: lot.auction.leiloeiro.name,
    isMyBid: myBidIds.has(lot.id),
  }));

  return (
    <AuditorioClient
      lots={serialized}
      userName={session.user.name.split(" ")[0]}
      ablyKey={process.env.NEXT_PUBLIC_ABLY_API_KEY ?? ""}
    />
  );
}
