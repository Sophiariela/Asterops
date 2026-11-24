import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { faqSchema } from "@/lib/validation";

export async function GET() {
  const entries = await prisma.faqEntry.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ entries });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = faqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  const entry = await prisma.faqEntry.create({ data: parsed.data });
  return NextResponse.json({ entry }, { status: 201 });
}
