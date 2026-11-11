export const siteConfig = {
  name: "Aster",
  legalName: "Aster Studio Ltda.",
  author: "Aster",
  tagline: "Digital solutions built around your business.",
  description:
    "Aster is a digital development studio. We design and develop websites, e-commerce, custom software and AI-powered systems for businesses, entrepreneurs, and individuals.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aster.studio",
  ogImage: "/opengraph-image",
  keywords: [
    "digital development studio",
    "website development",
    "custom software development",
    "web applications",
    "e-commerce development",
    "business automation",
  ],
};

export type SiteConfig = typeof siteConfig;
