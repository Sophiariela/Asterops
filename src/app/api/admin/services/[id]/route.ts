import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validation";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data." },
      { status: 400 },
    );
  }

  const conflicting = await prisma.service.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (conflicting) {
    return NextResponse.json({ error: "A solution with this slug already exists." }, { status: 409 });
  }

  const service = await prisma.service.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ service });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
