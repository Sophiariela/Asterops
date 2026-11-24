import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validation";

export async function GET() {
  const categories = await prisma.serviceCategory.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data." },
      { status: 400 },
    );
  }

  const existing = await prisma.serviceCategory.findFirst({
    where: { OR: [{ slug: parsed.data.slug }, { code: parsed.data.code }] },
  });
  if (existing) {
    return NextResponse.json(
      { error: "A category with this slug or code already exists." },
      { status: 409 },
    );
  }

  const category = await prisma.serviceCategory.create({ data: parsed.data });
  return NextResponse.json({ category }, { status: 201 });
}
