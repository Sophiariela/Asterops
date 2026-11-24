import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { isNotionConfigured, mirrorInquiryToNotion } from "@/lib/notion";
import { isEmailConfigured, notifyAdminOfInquiry } from "@/lib/email";

/** Espelha o schema do cliente em components/contact/contact-form.tsx. */
const inquirySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  whatsapp: z.string().min(10).max(40),
  businessName: z.string().max(160).optional(),
  businessType: z.string().min(1).max(80),
  service: z.string().min(1).max(120),
  message: z.string().min(10).max(4000),
  problem: z.string().max(4000).optional(),
  budget: z.string().max(80).optional(),
  timeline: z.string().max(80).optional(),
  /** Nível escolhido no cartão de plano — entra junto do serviço. */
  tier: z.string().max(80).optional(),
});

/** Janela da trava de duplicado: dois envios iguais em sequência. */
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;

function blank(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Valida e grava cada pedido como uma linha de `Inquiry` — a fonte de
 * verdade que aparece no painel. Notion e e-mail são espelhos
 * secundários, best-effort: nenhum dos dois derruba um envio válido.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Confira os campos e tente de novo." },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const service = input.tier ? `${input.service} · Nível ${input.tier}` : input.service;

  const data = {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    whatsapp: input.whatsapp.trim(),
    businessName: blank(input.businessName),
    businessType: input.businessType,
    service,
    message: input.message.trim(),
    problem: blank(input.problem),
    budget: blank(input.budget),
    timeline: blank(input.timeline),
  };

  // Trava de duplicado: clique duplo no botão ou reenvio do mesmo pedido
  // minutos depois não criam duas linhas. Responde sucesso (idempotente)
  // em vez de erro — do ponto de vista de quem enviou, deu certo mesmo.
  const recent = await prisma.inquiry.findFirst({
    where: {
      email: data.email,
      message: data.message,
      createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
    },
    orderBy: { createdAt: "desc" },
  });

  if (recent) {
    return NextResponse.json({ success: true, id: recent.id, duplicate: true });
  }

  const inquiry = await prisma.inquiry.create({ data });

  if (isNotionConfigured()) {
    mirrorInquiryToNotion(data).catch((error) => {
      console.error("Failed to mirror inquiry to Notion:", error);
    });
  }

  if (isEmailConfigured()) {
    notifyAdminOfInquiry({ ...data, id: inquiry.id }).catch((error) => {
      console.error("Failed to send inquiry notification email:", error);
    });
  }

  return NextResponse.json({ success: true, id: inquiry.id });
}
