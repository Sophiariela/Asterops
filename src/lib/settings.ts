import { cache } from "react";

import type { SiteSettings } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Padrão de fábrica das configurações do site.
 *
 * Os campos de hero ficam vazios de propósito: os componentes tratam
 * string vazia como "não editado pelo painel" e caem para `homeContent`,
 * que é a copy canônica em `src/config/content.ts`.
 */
const FALLBACK_SETTINGS: SiteSettings = {
  id: "default",
  studioName: "Aster",
  contactEmail: "hello@aster.studio",
  whatsapp: null,
  instagramUrl: null,
  linkedinUrl: null,
  ctaLabel: "Start a Project",
  ctaHref: "/contact",
  footerNote: "Digital products, software and automation built around your business.",
  heroEyebrow: "",
  heroHeadline: "",
  heroSubheadline: "",
  heroPrimaryCta: "",
  heroSecondaryCta: "",
  updatedAt: new Date(0),
};

/**
 * Carrega as configurações editáveis do painel.
 *
 * Todo o site público passa por aqui (`(site)/layout.tsx`), então uma falha
 * de banco não pode derrubar a página inteira: banco fora do ar, migração
 * pendente ou linha ausente caem no padrão de fábrica e o site continua
 * servindo a copy de `content.ts`. O erro vai para o log porque é problema
 * de infraestrutura a resolver, não algo que o visitante deva ver.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    return settings ?? FALLBACK_SETTINGS;
  } catch (error) {
    console.error("Failed to load SiteSettings; serving factory defaults:", error);
    return FALLBACK_SETTINGS;
  }
});
