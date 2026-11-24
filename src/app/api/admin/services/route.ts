import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validation";

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ services });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data." },
      { status: 400 },
    );
  }

  const existing = await prisma.service.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A solution with this slug already exists." }, { status: 409 });
  }

  const service = await prisma.service.create({ data: parsed.data });
  return NextResponse.json({ service }, { status: 201 });
}
