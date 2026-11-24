import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const settingsSchema = z.object({
  studioName: z.string().min(1),
  contactEmail: z.string().email(),
  whatsapp: z.string().optional(),
  whatsappMessage: z.string().min(1),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
  footerNote: z.string().min(1),
  // Hero da home. Campo vazio = usa o padrão de src/config/content.ts.
  heroEyebrow: z.string().default(""),
  heroHeadline: z.string().default(""),
  heroSubheadline: z.string().default(""),
  heroPrimaryCta: z.string().default(""),
  heroSecondaryCta: z.string().default(""),
});

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  const { whatsapp, instagramUrl, ...rest } = parsed.data;
  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: { ...rest, whatsapp: whatsapp || null, instagramUrl: instagramUrl || null },
    create: { id: "default", ...rest, whatsapp: whatsapp || null, instagramUrl: instagramUrl || null },
  });

  return NextResponse.json({ settings });
}
