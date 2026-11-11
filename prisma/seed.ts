import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const services = [
  {
    title: "Website Development",
    slug: "website-development",
    description: "Professional, responsive websites designed to establish credibility and convert visitors.",
    icon: "Globe",
    order: 1,
  },
  {
    title: "E-commerce Development",
    slug: "ecommerce-development",
    description: "Online stores with product catalogs, checkout experiences, and business integrations.",
    icon: "ShoppingCart",
    order: 2,
  },
  {
    title: "Custom Software",
    slug: "custom-software",
    description: "Tailored systems that simplify operations and solve specific business problems.",
    icon: "Code2",
    order: 3,
  },
  {
    title: "Web Applications",
    slug: "web-applications",
    description: "Interactive web-based platforms, portals, and applications.",
    icon: "LayoutPanelLeft",
    order: 4,
  },
  {
    title: "Dashboards & Admin Systems",
    slug: "dashboards-admin-systems",
    description: "Centralized interfaces for managing business operations, customers, information, and workflows.",
    icon: "LayoutDashboard",
    order: 5,
  },
  {
    title: "Automation & AI",
    slug: "automation-ai",
    description: "Intelligent integrations, automated processes, and AI-powered business tools.",
    icon: "Bot",
    order: 6,
  },
];

const portfolioProjects = [
  {
    name: "Fulô Crochet",
    slug: "fulo-crochet",
    category: "Website Development",
    shortDescription: "Digital presence rebuild for a handmade crochet fashion brand.",
    fullDescription:
      "Fulô Crochet ran almost entirely on Instagram and WhatsApp, with no owned digital hub and no structured path from browsing to buying. We rebuilt the brand's digital presence from the ground up: a clear site architecture, a conversion-focused structure, and an operational foundation the business can keep building on.",
    coverImage: null,
    gallery: [],
    projectUrl: "https://fulo-crochet-site.onrender.com",
    technologies: ["Next.js", "Tailwind CSS"],
    classification: "CLIENT_PROJECT" as const,
    status: "LIVE" as const,
    order: 1,
  },
  {
    name: "Ready Set",
    slug: "ready-set",
    category: "Website Development",
    shortDescription: "UX, CRO and accessibility audit for a D2C wellness drink brand.",
    fullDescription:
      "A full audit of drinkreadyset.com covering UX, copy, trust signals, visual hierarchy and the complete purchase flow, benchmarked against premium wellness-brand execution. Delivered as a prioritized roadmap — quick wins, medium-effort fixes, and high-impact CRO changes — rather than a generic checklist.",
    coverImage: null,
    gallery: [],
    projectUrl: "https://drinkreadyset.com",
    technologies: [],
    classification: "CLIENT_PROJECT" as const,
    status: "DELIVERED" as const,
    order: 2,
  },
  {
    name: "Good Vibes Va'a",
    slug: "good-vibes-vaa",
    category: "Website Development",
    shortDescription: "Website for a Hawaiian outrigger canoe club in Salvador, Brazil.",
    fullDescription:
      "A site for Good Vibes Va'a presenting the club's paddling experiences, recurring training plans, and private group outings, along with captains, community photos, merchandise and WhatsApp-based booking.",
    coverImage: null,
    gallery: [],
    projectUrl: "https://goodvibesvaa.vercel.app",
    technologies: ["Next.js"],
    classification: "CLIENT_PROJECT" as const,
    status: "LIVE" as const,
    order: 3,
  },
  {
    name: "WebOS",
    slug: "webos",
    category: "Website Development",
    shortDescription: "Internal template system for premium website builds.",
    fullDescription:
      "An internal product used by the studio to produce premium website and landing-page templates faster across client engagements — not a commissioned client project.",
    coverImage: null,
    gallery: [],
    projectUrl: null,
    technologies: ["Next.js", "Tailwind CSS"],
    classification: "INTERNAL_PRODUCT" as const,
    status: "IN_PROGRESS" as const,
    order: 4,
  },
  {
    name: "CommerceOS",
    slug: "commerceos",
    category: "E-commerce Development",
    shortDescription: "Internal toolkit for Shopify theme and storefront builds.",
    fullDescription:
      "An internal product line for building Shopify themes, product pages and conversion-focused storefronts — used to speed up e-commerce engagements, not a standalone client deliverable.",
    coverImage: null,
    gallery: [],
    projectUrl: null,
    technologies: ["Shopify", "Liquid"],
    classification: "INTERNAL_PRODUCT" as const,
    status: "IN_PROGRESS" as const,
    order: 5,
  },
];

async function main() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  for (const project of portfolioProjects) {
    await prisma.portfolioProject.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      studioName: "Aster",
      contactEmail: "contact@aster.studio",
      whatsapp: null,
      instagramUrl: "https://instagram.com/aster.ops",
      ctaLabel: "Start a Project",
      ctaHref: "/contact",
      footerNote: "Digital solutions built around your business.",
    },
  });

  const seedEmail = process.env.ADMIN_SEED_EMAIL;
  const seedPassword = process.env.ADMIN_SEED_PASSWORD;
  if (seedEmail && seedPassword) {
    const passwordHash = await bcrypt.hash(seedPassword, 12);
    await prisma.adminUser.upsert({
      where: { email: seedEmail },
      update: { passwordHash },
      create: { email: seedEmail, passwordHash },
    });
    console.log(`Admin user ready: ${seedEmail}`);
  } else {
    console.warn("ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD not set — skipped admin user seed.");
  }

  console.log(`Seeded ${services.length} services and ${portfolioProjects.length} portfolio projects.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
