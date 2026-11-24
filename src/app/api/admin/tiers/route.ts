import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { tierSchema } from "@/lib/validation";

export async function GET() {
  const tiers = await prisma.solutionTier.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ tiers });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = tierSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  const existing = await prisma.solutionTier.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A tier with this slug already exists." }, { status: 409 });
  }

  const tier = await prisma.solutionTier.create({ data: parsed.data });
  return NextResponse.json({ tier }, { status: 201 });
}
