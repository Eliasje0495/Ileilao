import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Rest as AblyRest } from "ably";
import { z } from "zod";

const postSchema = z.object({
  sessionId: z.string().min(8),
  content:   z.string().min(1).max(2000),
  sender:    z.enum(["user", "support"]).default("user"),
});

// GET /api/chat?session=xxx
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session");
  if (!sessionId) return NextResponse.json({ messages: [] });

  const messages = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  return NextResponse.json({ messages });
}

// POST /api/chat — visitor sends a message
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const { sessionId, content, sender } = parsed.data;

  const msg = await prisma.chatMessage.create({
    data: { sessionId, sender, content },
  });

  // Publish to Ably so the other side gets it in real-time
  const apiKey = process.env.ABLY_API_KEY;
  if (apiKey) {
    try {
      const ably = new AblyRest(apiKey);
      await ably.channels.get(`chat:${sessionId}`).publish("message", {
        id: msg.id, sender: msg.sender, content: msg.content, createdAt: msg.createdAt,
      });
    } catch { /* non-fatal */ }
  }

  return NextResponse.json({ message: msg }, { status: 201 });
}
