export const siteConfig = {
  name: "Aster",
  legalName: "Aster Studio Ltda.",
  author: "Aster",
  tagline: "Intelligent digital systems for ambitious businesses.",
  description:
    "Aster builds intelligent digital systems that help businesses attract customers, automate operations, and scale — the technology infrastructure behind modern companies, not just a website.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aster.studio",
  ogImage: "/opengraph-image",
  keywords: [
    "digital systems studio",
    "AI automation",
    "business intelligence",
    "digital infrastructure",
    "e-commerce systems",
    "AI powered workflows",
  ],
};

export type SiteConfig = typeof siteConfig;
