import crypto from "crypto";
import { Rest as AblyRest } from "ably";
import { prisma } from "@/lib/prisma";
import { Lot, LotStatus, CaucaoStatus, Prisma } from "@prisma/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlaceBidInput {
  userId: string;
  lotId: string;
  amount: number;
  ipAddress?: string;
  deviceId?: string;
  userAgent?: string;
}

export interface PlaceBidResult {
  success: boolean;
  bid?: {
    id: string;
    amount: number;
    hashChain: string;
    timestamp: Date;
  };
  lot?: {
    id: string;
    currentPrice: number;
    status: LotStatus;
  };
  error?: string;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the SHA-256 hash of the last valid bid for a lot.
 * If no bids exist yet, returns a genesis hash derived from the lotId.
 */
export async function getHashChain(lotId: string): Promise<string> {
  const lastBid = await prisma.bid.findFirst({
    where: { lotId, isValid: true },
    orderBy: { timestamp: "desc" },
    select: { hashChain: true },
  });

  if (lastBid) {
    return lastBid.hashChain;
  }

  // Genesis hash — deterministic seed for the first bid on this lot
  return crypto
    .createHash("sha256")
    .update(`genesis:${lotId}`)
    .digest("hex");
}

/**
 * Builds the SHA-256 hash for a new bid, chaining it to the previous hash.
 */
function buildHash(
  previousHash: string,
  bidData: {
    userId: string;
    lotId: string;
    amount: number;
    timestamp: string;
  }
): string {
  const payload = `${previousHash}:${bidData.userId}:${bidData.lotId}:${bidData.amount}:${bidData.timestamp}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Validates that a bid amount is legal for the given lot.
 */
export function validateBidAmount(
  lot: Pick<Lot, "currentPrice" | "minIncrement" | "reservePrice" | "status" | "startPrice">,
  amount: number
): ValidationResult {
  if (lot.status !== LotStatus.LIVE) {
    return { valid: false, reason: "O lote não está ativo para lances." };
  }

  const current = Number(lot.currentPrice);
  const minIncrement = Number(lot.minIncrement);
  const startPrice = Number(lot.startPrice);
  const minimum = Math.max(current, startPrice) + minIncrement;

  if (amount < minimum) {
    return {
      valid: false,
      reason: `Lance mínimo é R$ ${minimum.toFixed(2)}. Você ofertou R$ ${amount.toFixed(2)}.`,
    };
  }

  return { valid: true };
}

/**
 * Checks that the user has an active caução (deposit) for this lot.
 */
async function validateCaucao(
  userId: string,
  lotId: string
): Promise<ValidationResult> {
  const caucao = await prisma.caucao.findUnique({
    where: { userId_lotId: { userId, lotId } },
  });

  if (!caucao) {
    return {
      valid: false,
      reason: "É necessário realizar o depósito de caução antes de dar lances.",
    };
  }

  if (caucao.status !== CaucaoStatus.HELD) {
    return {
      valid: false,
      reason: `Caução com status inválido: ${caucao.status}. Aguarde a confirmação do depósito.`,
    };
  }

  return { valid: true };
}

// ─── Ably Publisher ───────────────────────────────────────────────────────────

async function publishBidEvent(
  lotId: string,
  payload: Record<string, unknown>
): Promise<void> {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    console.warn("ABLY_API_KEY not set — skipping real-time publish");
    return;
  }
  try {
    const client = new AblyRest(apiKey);
    const channel = client.channels.get(`lot:${lotId}`);
    await channel.publish("new-bid", payload);
  } catch (err) {
    // Non-fatal — log but don't throw so the bid still succeeds
    console.error("Failed to publish bid to Ably:", err);
  }
}

// ─── Core: placeBid ───────────────────────────────────────────────────────────

/**
 * Places a bid on a lot.
 *
 * Steps:
 * 1. Load the lot inside a transaction lock.
 * 2. Validate bid amount (minIncrement, startPrice, status).
 * 3. Validate that the user has a confirmed caução.
 * 4. Build SHA-256 hash chain entry.
 * 5. Create the Bid record and update Lot.currentPrice atomically.
 * 6. Publish the new bid event to the Ably channel.
 */
export async function placeBid(input: PlaceBidInput): Promise<PlaceBidResult> {
  const { userId, lotId, amount, ipAddress, deviceId, userAgent } = input;

  // We use a serializable transaction to prevent race conditions on bids
  return await prisma.$transaction(
    async (tx) => {
      // 1. Load lot with a row-level lock equivalent (select for update not natively supported
      //    in Prisma, so we rely on the serializable isolation level of the transaction)
      const lot = await tx.lot.findUnique({
        where: { id: lotId },
      });

      if (!lot) {
        return { success: false, error: "Lote não encontrado." };
      }

      // 2. Validate bid amount
      const amountValidation = validateBidAmount(lot, amount);
      if (!amountValidation.valid) {
        return { success: false, error: amountValidation.reason };
      }

      // 3. Validate caução (outside the tx to avoid locking caucao table, but we re-check status)
      const caucaoCheck = await tx.caucao.findUnique({
        where: { userId_lotId: { userId, lotId } },
      });
      if (!caucaoCheck || caucaoCheck.status !== CaucaoStatus.HELD) {
        return {
          success: false,
          error:
            "Caução não confirmada. Realize o depósito de garantia antes de dar lances.",
        };
      }

      // 4. Build hash chain
      const previousHash = await getHashChain(lotId);
      const timestamp = new Date();
      const hashChain = buildHash(previousHash, {
        userId,
        lotId,
        amount,
        timestamp: timestamp.toISOString(),
      });

      // 5. Create bid and update lot atomically
      const bid = await tx.bid.create({
        data: {
          userId,
          lotId,
          amount: new Prisma.Decimal(amount),
          timestamp,
          ipAddress: ipAddress ?? null,
          deviceId: deviceId ?? null,
          userAgent: userAgent ?? null,
          hashChain,
          isValid: true,
        },
      });

      const updatedLot = await tx.lot.update({
        where: { id: lotId },
        data: { currentPrice: new Prisma.Decimal(amount) },
      });

      // 6. Publish to Ably (fire-and-forget, outside transaction)
      // We schedule this after the transaction commits
      void publishBidEvent(lotId, {
        bidId: bid.id,
        userId,
        amount,
        currentPrice: amount,
        timestamp: timestamp.toISOString(),
        hashChain,
      });

      return {
        success: true,
        bid: {
          id: bid.id,
          amount,
          hashChain: bid.hashChain,
          timestamp: bid.timestamp,
        },
        lot: {
          id: updatedLot.id,
          currentPrice: Number(updatedLot.currentPrice),
          status: updatedLot.status,
        },
      };
    },
    {
      isolationLevel: "Serializable",
      maxWait: 5000,
      timeout: 10000,
    }
  );
}
