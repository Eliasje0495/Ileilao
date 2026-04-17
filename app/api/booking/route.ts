import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name:    z.string().min(2),
  email:   z.email(),
  assunto: z.string().min(2),
  date:    z.string(), // ISO string
  notes:   z.string().optional(),
});

// GET /api/booking?date=YYYY-MM-DD — returns booked slots for that day
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ slots: [] });

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const bookings = await prisma.booking.findMany({
    where: { date: { gte: start, lte: end }, status: { not: "CANCELLED" } },
    select: { date: true },
  });

  const slots = bookings.map(b => b.date.toISOString());
  return NextResponse.json({ slots });
}

// POST /api/booking — create a booking
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

  const { name, email, assunto, date, notes } = parsed.data;
  const dt = new Date(date);

  // Check slot is still free
  const conflict = await prisma.booking.findFirst({
    where: { date: dt, status: { not: "CANCELLED" } },
  });
  if (conflict) return NextResponse.json({ error: "Horário já reservado. Escolha outro." }, { status: 409 });

  const booking = await prisma.booking.create({
    data: { name, email, assunto, date: dt, notes },
  });

  return NextResponse.json({ booking }, { status: 201 });
}
