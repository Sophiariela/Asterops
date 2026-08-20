import { GraduationCap, Gem, ShoppingBag, Store, Users } from "lucide-react";
import type { DesignInspiration, DesignInspirationsContent } from "@/types";

/**
 * Section-level copy for Design Inspirations. Keep this framed as visual
 * references, never as products, pricing, or anything purchasable — clients
 * hire Aster to build a custom solution; these show the standard it's built to.
 */
export const designInspirationsContent: DesignInspirationsContent = {
  eyebrow: "Design Inspirations",
  title: "The design direction and execution behind Aster projects.",
  description:
    "A look at the visual language, storytelling and craft Aster brings to client work — each one a reference point for what's possible, not something you buy off the shelf.",
  liveLabel: "Visual Reference",
  conceptLabel: "Concept Direction",
  disclaimer:
    "These are visual references, not products. Every Aster engagement is designed and built as a custom solution for the business commissioning it.",
};

/**
 * Add a new direction by adding a `DesignInspiration` object here — the
 * homepage section renders directly from this array. `status: "concept"`
 * entries don't need an `image` or `demoUrl`; they render with an icon
 * placeholder and only the "Build Something Similar" action.
 */
export const designInspirations: DesignInspiration[] = [
  {
    slug: "fulo-crochet",
    name: "Fulô Crochet",
    category: "Fashion & Commerce",
    description:
      "A premium digital commerce experience focused on storytelling, visual presentation, and customer journey.",
    status: "live",
    icon: ShoppingBag,
    image: "/design-inspirations/fulo-crochet/storefront-desktop.svg",
    demoUrl: "https://fulo-crochet-site.onrender.com/",
  },
  {
    slug: "modern-retail",
    name: "Modern Retail",
    category: "Retail & Consumer Goods",
    description:
      "A fast, confident storefront direction built around product discovery — for brands that sell at volume, not just at a glance.",
    status: "concept",
    icon: Store,
  },
  {
    slug: "luxury-commerce",
    name: "Luxury Commerce",
    category: "Luxury & Premium Goods",
    description:
      "A restrained, deliberate commerce direction for high-end brands, where pacing and detail carry the sale more than any single page.",
    status: "concept",
    icon: Gem,
  },
  {
    slug: "education-experience",
    name: "Education Experience",
    category: "Education & Learning",
    description:
      "A guided enrollment direction for schools and course creators — from first visit to committed student, without the spreadsheet in between.",
    status: "concept",
    icon: GraduationCap,
  },
  {
    slug: "community-platform",
    name: "Community Platform",
    category: "Community & Membership",
    description:
      "A membership-first direction for businesses building belonging — access, content and connection designed as one experience.",
    status: "concept",
    icon: Users,
  },
];

export function getInspirationBySlug(slug: string): DesignInspiration | undefined {
  return designInspirations.find((inspiration) => inspiration.slug === slug);
}

export function getInspirationSlugs(): string[] {
  return designInspirations.map((inspiration) => inspiration.slug);
}

/** Deep-links the contact form to the design direction a visitor came from. */
export function inspirationContactHref(slug: string): string {
  return `/contact?inspiration=${slug}`;
}
