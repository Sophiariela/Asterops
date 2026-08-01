import { NextResponse } from "next/server";
import { z } from "zod";

import { createLeadInNotion } from "@/lib/notion";
import { productInterestOptions } from "@/config/contact";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  productInterest: z.enum(productInterestOptions),
  message: z.string().min(10),
});

/**
 * Validates contact submissions and stores each one as a new lead in the
 * Notion CRM database. See docs/notion-crm-setup.md for how to provision
 * the database and integration credentials.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  try {
    await createLeadInNotion(parsed.data);
  } catch (error) {
    console.error("Failed to store contact submission in Notion:", error);
    return NextResponse.json(
      { error: "We couldn't process your request right now. Please try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
