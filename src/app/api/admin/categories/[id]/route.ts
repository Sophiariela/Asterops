import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validation";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data." },
      { status: 400 },
    );
  }

  const conflicting = await prisma.serviceCategory.findFirst({
    where: {
      NOT: { id },
      OR: [{ slug: parsed.data.slug }, { code: parsed.data.code }],
    },
  });
  if (conflicting) {
    return NextResponse.json(
      { error: "A category with this slug or code already exists." },
      { status: 409 },
    );
  }

  const category = await prisma.serviceCategory.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ category });
}

/**
 * Apagar categoria não apaga solução: o relacionamento é `onDelete: SetNull`,
 * então as soluções ficam sem categoria e seguem editáveis no painel em vez
 * de desaparecerem junto.
 */
export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.serviceCategory.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
