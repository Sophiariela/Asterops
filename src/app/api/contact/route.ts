import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { isNotionConfigured, mirrorInquiryToNotion } from "@/lib/notion";

const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  businessName: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10),
  timeline: z.string().optional(),
});

/**
 * Validates project inquiries and persists each one as an `Inquiry` row —
 * the source of truth surfaced in the admin panel. Notion is a best-effort
 * secondary mirror and never blocks a successful submission.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const inquiry = await prisma.inquiry.create({ data: parsed.data });

  if (isNotionConfigured()) {
    mirrorInquiryToNotion(parsed.data).catch((error) => {
      console.error("Failed to mirror inquiry to Notion:", error);
    });
  }

  return NextResponse.json({ success: true, id: inquiry.id });
}
