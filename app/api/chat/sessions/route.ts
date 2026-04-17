import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/chat/sessions — admin: list all active chat sessions
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["ADMIN", "LEILOEIRO"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get latest message per session
  const latest = await prisma.chatMessage.findMany({
    orderBy: { createdAt: "desc" },
    distinct: ["sessionId"],
    take: 50,
  });

  // Count unread per session
  const unreadCounts = await prisma.chatMessage.groupBy({
    by: ["sessionId"],
    where: { sender: "user", read: false },
    _count: { id: true },
  });

  const unreadMap = Object.fromEntries(unreadCounts.map(r => [r.sessionId, r._count.id]));

  const sessions = latest.map(m => ({
    sessionId: m.sessionId,
    lastMessage: m.content,
    lastAt: m.createdAt,
    unread: unreadMap[m.sessionId] ?? 0,
  }));

  return NextResponse.json({ sessions });
}
