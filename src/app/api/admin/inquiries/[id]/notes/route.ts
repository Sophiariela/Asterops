import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const noteSchema = z.object({ content: z.string().min(1) });

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = noteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Note can't be empty." }, { status: 400 });
  }

  const note = await prisma.inquiryNote.create({ data: { inquiryId: id, content: parsed.data.content } });
  return NextResponse.json({ note }, { status: 201 });
}
