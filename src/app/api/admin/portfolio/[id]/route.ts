import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const projectSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only."),
  category: z.string().min(1),
  shortDescription: z.string().min(1),
  fullDescription: z.string().min(1),
  coverImage: z.string().url().optional().or(z.literal("")),
  gallery: z.array(z.string().url()).default([]),
  projectUrl: z.string().url().optional().or(z.literal("")),
  technologies: z.array(z.string()).default([]),
  classification: z.enum(["CLIENT_PROJECT", "INTERNAL_PRODUCT", "PROTOTYPE"]),
  status: z.enum(["LIVE", "DELIVERED", "IN_PROGRESS"]),
  published: z.boolean(),
  order: z.number().int(),
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  const conflicting = await prisma.portfolioProject.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
  if (conflicting) {
    return NextResponse.json({ error: "A project with this slug already exists." }, { status: 409 });
  }

  const { coverImage, projectUrl, ...rest } = parsed.data;
  const project = await prisma.portfolioProject.update({
    where: { id },
    data: { ...rest, coverImage: coverImage || null, projectUrl: projectUrl || null },
  });
  return NextResponse.json({ project });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.portfolioProject.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
