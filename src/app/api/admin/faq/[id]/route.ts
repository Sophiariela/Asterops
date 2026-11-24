import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { faqSchema } from "@/lib/validation";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = faqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  const entry = await prisma.faqEntry.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ entry });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.faqEntry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
