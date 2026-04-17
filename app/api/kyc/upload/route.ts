import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Simple file storage: saves to /tmp and returns a placeholder URL.
// In production, replace this with S3/Supabase Storage upload.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const type = formData.get("type") as string | null;

  if (!file || !type) return NextResponse.json({ error: "Arquivo e tipo são obrigatórios." }, { status: 400 });

  const validTypes = ["CPF", "RG", "CNH", "COMPROVANTE"];
  if (!validTypes.includes(type)) return NextResponse.json({ error: "Tipo inválido." }, { status: 400 });

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) return NextResponse.json({ error: "Arquivo muito grande. Máximo 10MB." }, { status: 400 });

  // Hash the file for integrity
  const buffer = Buffer.from(await file.arrayBuffer());
  const hash = crypto.createHash("sha256").update(buffer).digest("hex");

  // Placeholder URL — replace with real storage (Supabase Storage / S3)
  const fileName = `kyc/${session.user.id}/${type}_${Date.now()}.${file.name.split(".").pop()}`;
  const url = `/uploads/${fileName}`;

  // Save/upsert KYC document record
  await prisma.kycDocument.upsert({
    where: {
      // No unique constraint on userId+type, so findFirst + create/update
      id: (await prisma.kycDocument.findFirst({ where: { userId: session.user.id, type } }))?.id ?? "new",
    },
    create: { userId: session.user.id, type, url, status: "PENDING" },
    update: { url, status: "PENDING", reviewedAt: null },
  });

  return NextResponse.json({ url, hash });
}
