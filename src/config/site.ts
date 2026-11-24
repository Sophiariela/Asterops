export const siteConfig = {
  name: "Aster",
  legalName: "Aster Studio Ltda.",
  author: "Aster",
  tagline: "Digital Products & Software Studio",
  description:
    "Aster is a digital products and software studio. We design and develop websites, web applications, business software, and automation that turn complex business needs into practical digital solutions.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aster.studio",
  ogImage: "/opengraph-image",
  /**
   * O site nasce em inglês. `src/i18n/config.ts` mantém a lista de locales
   * para a localização em pt-BR entrar depois sem reescrever as páginas: a
   * copy pública vive em `content.ts` e no banco, não embutida no JSX.
   */
  locale: "en",
  keywords: [
    "digital product studio",
    "custom software development",
    "web application development",
    "business software development",
    "booking system development",
    "custom crm development",
    "workflow automation",
    "api integrations",
  ],
};

export type SiteConfig = typeof siteConfig;
