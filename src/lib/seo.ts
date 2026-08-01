import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { contactEmail, instagramUrl } from "@/config/socials";
import type { CaseStudy, Product } from "@/types";

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export function buildMetadata({ title, description, path, image }: PageMetadataInput): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  const ogImage = image ?? siteConfig.ogImage;

  return {
    title,
    description,
    authors: [{ name: siteConfig.author, url: siteConfig.url }],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/opengraph-image`,
    description: siteConfig.description,
    email: contactEmail,
    contactPoint: {
      "@type": "ContactPoint",
      email: contactEmail,
      contactType: "customer support",
    },
    sameAs: [instagramUrl],
  };
}

export function caseStudyJsonLd(caseStudy: CaseStudy) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${caseStudy.client} — Case Study`,
    description: caseStudy.hero.summary,
    url: `${siteConfig.url}/case-studies/${caseStudy.slug}`,
    creator: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    about: caseStudy.client,
    genre: caseStudy.industry,
  };
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: product.hero.description,
    url: `${siteConfig.url}/product/${product.slug}`,
    offers: product.pricing?.tiers.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      price: tier.price.replace(/[^0-9.]/g, "") || undefined,
      priceCurrency: tier.price.startsWith("$") ? "USD" : undefined,
      description: tier.description,
    })),
  };
}
