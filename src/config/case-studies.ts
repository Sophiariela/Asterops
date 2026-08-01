import {
  BarChart3,
  Boxes,
  Compass,
  Gauge,
  Layers,
  Palette,
  Route,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
} from "lucide-react";
import type { CaseStudy } from "@/types";

export const caseStudies: CaseStudy[] = [
  {
    slug: "fulo",
    client: "Fulô Crochet",
    industry: "Handcrafted Fashion / E-commerce",
    year: "2025",
    isPublicLink: false,
    hero: {
      eyebrow: "Case Study",
      title: "Fulô Crochet",
      subtitle: "Premium E-commerce Experience for a Handmade Fashion Brand",
      summary:
        "Aster designed and developed a digital commerce experience focused on storytelling, visual identity, and customer experience for a handcrafted crochet brand.",
    },
    challenge: {
      title: "A handmade brand needed a digital presence that matched the quality of its craft",
      description:
        "Every Fulô piece is made by hand, one at a time — but the brand's online presence didn't reflect that care. Without a dedicated commerce experience, visitors had no clear way to browse the collection, understand the craftsmanship behind each piece, or trust the buying process enough to check out.",
      points: [
        "No dedicated e-commerce experience built to present handcrafted products at a premium level",
        "No structured customer journey guiding visitors from discovery to checkout",
        "A strong brand identity that hadn't been translated into a cohesive digital storefront",
        "No foundation in place to understand visitor behavior or plan future growth",
      ],
    },
    solution: {
      title: "A commerce system built around craft, trust and story",
      description:
        "Aster approached Fulô as a complete digital system rather than a one-off website — mapping the brand's identity into a structured commerce experience engineered to build trust at every step, from first visit to checkout.",
      approach: [
        {
          icon: Compass,
          title: "Digital strategy",
          description: "Mapped the brand's positioning and product story into a clear plan for the commerce experience before any design work began.",
        },
        {
          icon: Palette,
          title: "UX/UI design",
          description: "A visual language built around the warmth and texture of handmade crochet, translated into a clean, premium interface.",
        },
        {
          icon: Layers,
          title: "E-commerce architecture",
          description: "A catalog and checkout structure built to scale from a first collection to a growing product line.",
        },
        {
          icon: ShoppingBag,
          title: "Product presentation",
          description: "Product pages designed to communicate craftsmanship and detail, not just list a price and an add-to-cart button.",
        },
        {
          icon: Smartphone,
          title: "Mobile-first experience",
          description: "Every screen designed for the phone first, since that's where the majority of shoppers discover and browse the brand.",
        },
        {
          icon: Gauge,
          title: "Performance optimization",
          description: "Fast-loading pages and optimized imagery, so product photography never comes at the cost of speed.",
        },
        {
          icon: Sparkles,
          title: "Brand storytelling",
          description: "Editorial moments woven through the journey that let the brand's story sell alongside the product.",
        },
      ],
    },
    deliverables: [
      {
        icon: Store,
        title: "E-commerce Website",
        description: "A fully structured storefront built to present and sell a handcrafted product catalog.",
      },
      {
        icon: Smartphone,
        title: "Responsive Design",
        description: "One consistent experience engineered across desktop, tablet and mobile.",
      },
      {
        icon: Boxes,
        title: "Product Catalog",
        description: "A scalable catalog structure ready to grow with new collections and product lines.",
      },
      {
        icon: Sparkles,
        title: "Digital Brand Experience",
        description: "Visual identity and storytelling carried consistently through every page.",
      },
      {
        icon: Route,
        title: "Customer Journey Design",
        description: "A guided path from discovery to checkout, designed to build trust at each step.",
      },
      {
        icon: BarChart3,
        title: "Analytics Foundation",
        description: "The tracking foundation in place to measure behavior and guide what comes next.",
      },
    ],
    gallery: {
      title: "A storefront designed to be seen everywhere",
      description: "A look at the experience across devices.",
      placeholderNotice:
        "Portfolio visuals — placeholders standing in for final production photography and will be replaced with live screens.",
      mockups: [
        { device: "desktop", image: "/case-studies/fulo/scene-desktop.svg", label: "Desktop" },
        { device: "laptop", image: "/case-studies/fulo/scene-desktop.svg", label: "Laptop" },
        { device: "tablet", image: "/case-studies/fulo/scene-tablet.svg", label: "Tablet" },
        { device: "mobile", image: "/case-studies/fulo/scene-mobile.svg", label: "Mobile" },
      ],
    },
    technology: {
      title: "Built on a modern commerce stack",
      description: "The same system-first approach Aster uses across every commerce build.",
      categories: [
        { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
        { label: "Backend", items: ["Server-rendered commerce logic", "Content & catalog management"] },
        { label: "Database", items: ["Structured product & order data"] },
        { label: "Hosting", items: ["Cloud hosting"] },
        { label: "Integrations", items: ["Checkout-ready payment foundation", "Contact & lead capture workflows"] },
      ],
    },
    results: {
      title: "Results",
      statement: "Project delivered and prepared for future growth, analytics, and e-commerce expansion.",
      metrics: [
        { label: "Conversion Rate" },
        { label: "Revenue Growth" },
        { label: "Orders" },
        { label: "Customer Retention" },
      ],
    },
    cta: {
      title: "Your business deserves more than a website.",
      description: "Build a digital system designed for growth.",
      primaryCta: { label: "Start a Project", href: "/contact" },
    },
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}

export function getCaseStudySlugs(): string[] {
  return caseStudies.map((caseStudy) => caseStudy.slug);
}
