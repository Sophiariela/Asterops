import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "DISCOVERY", "PROPOSAL_SENT", "IN_PROGRESS", "COMPLETED", "LOST"]),
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const inquiry = await prisma.inquiry.update({ where: { id }, data: { status: parsed.data.status } });
  return NextResponse.json({ inquiry });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.inquiry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
