export const siteConfig = {
  name: "Aster",
  legalName: "Aster Studio Ltda.",
  author: "Aster",
  tagline: "Tecnologia implementada para o seu negócio",
  description:
    "A Aster implementa a tecnologia do seu negócio: site profissional, agendamento online, WhatsApp automatizado, gestão de clientes e sistemas sob medida. Atendemos salões, studios de unha, lash e brow, estética e spas.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aster.studio",
  ogImage: "/opengraph-image",
  locale: "pt_BR",
  /** Nicho de entrada da operação comercial — orienta copy e SEO. */
  primaryNiche: "beleza e estética",
  keywords: [
    "agendamento online para salão",
    "automação de whatsapp para salão de beleza",
    "site para studio de unhas",
    "sistema para clínica de estética",
    "automação para profissionais de beleza",
    "desenvolvimento de software sob medida",
  ],
};

export type SiteConfig = typeof siteConfig;
