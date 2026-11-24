import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { catalog, homeFaq } from "./catalog";

const prisma = new PrismaClient();

/**
 * Conteúdo de partida do site.
 *
 * Tudo aqui é editável depois pelo painel — o seed existe para o catálogo
 * nascer com conteúdo real, não para congelar texto. Usa upsert por slug:
 * rodar de novo atualiza, nunca apaga pedido nem derruba dado de produção.
 *
 * Exceção consciente: a FAQ de cada solução é regravada a cada execução
 * (apaga e recria), porque pergunta não tem chave natural. Pergunta criada
 * à mão pelo painel numa solução do catálogo se perde num reseed — está
 * documentado aqui para não ser surpresa.
 */

/**
 * Serviços das posições antigas que saíram da vitrine.
 *
 * Desativados, nunca apagados: podem estar referenciados em pedido já
 * recebido, e `active: false` já os tira do site público.
 */
const retiredServiceSlugs = [
  "website-development",
  "custom-software",
  "web-applications",
  "dashboards-admin-systems",
  "automation-ai",
  // Posicionamento pt-BR anterior.
  "presenca-digital",
  "agendamento-online",
  "automacao-whatsapp",
  "gestao-do-negocio",
  "vendas-online",
  "software-sob-medida",
];

/**
 * Projetos reais do estúdio.
 *
 * Classificação e URL vêm do que já está no banco e é verificável. As
 * imagens são screenshots dos próprios projetos, em `public/projects`.
 * Projeto sem screenshot fica sem capa — não se inventa imagem.
 */
const portfolioProjects = [
  {
    name: "Good Vibes Va’a",
    slug: "good-vibes-vaa",
    category: "Website & Booking",
    shortDescription:
      "Website and online booking flow for an outrigger canoe operator, including experience catalogue and a four-step reservation journey.",
    fullDescription:
      "Aster designed and built the public website and the booking experience for Good Vibes Va’a. Visitors browse the available experiences and complete a reservation through a guided four-step flow, with the operator managing availability behind it. Built with Next.js and deployed on Vercel.",
    coverImage: "/projects/good-vibes-vaa-home.webp",
    gallery: ["/projects/good-vibes-vaa-agendar.webp", "/projects/good-vibes-vaa-mobile.webp"],
    projectUrl: "https://goodvibesvaa.vercel.app",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    classification: "CLIENT_PROJECT" as const,
    status: "LIVE" as const,
    order: 1,
  },
  {
    name: "Fulô Crochet",
    slug: "fulo-crochet",
    category: "E-commerce",
    shortDescription:
      "Storefront for a handmade crochet brand, with product catalogue, product detail pages and a mobile-first storefront.",
    fullDescription:
      "An online storefront built for Fulô Crochet, a handmade crochet brand. The catalogue presents products with imagery and detail pages, designed mobile-first because that is where the brand's customers arrive from.",
    coverImage: "/projects/fulo-crochet-home.webp",
    gallery: ["/projects/fulo-crochet-mobile.webp"],
    projectUrl: "https://fulo-crochet-site.onrender.com",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    classification: "CLIENT_PROJECT" as const,
    status: "LIVE" as const,
    order: 2,
  },
  {
    name: "Ready Set",
    slug: "ready-set",
    category: "Website Development",
    shortDescription:
      "Brand website for a drinks product, built as a conversion-focused single-purpose site.",
    fullDescription:
      "A brand and product website delivered for Ready Set. Built as a focused marketing site: product presentation, brand narrative and a single clear path to action.",
    coverImage: "/projects/ready-set-home.webp",
    gallery: [],
    projectUrl: "https://drinkreadyset.com",
    technologies: ["Next.js", "React", "Tailwind CSS"],
    classification: "CLIENT_PROJECT" as const,
    status: "DELIVERED" as const,
    order: 3,
  },
];

/**
 * Produtos internos.
 *
 * Ficam no portfólio identificados como produto interno em construção —
 * é trabalho real do estúdio e aparece rotulado como tal. O que o briefing
 * proíbe é usar esses nomes como categoria comercial da vitrine, não
 * reconhecer que existem.
 */
const internalProducts = [
  {
    name: "WebOS",
    slug: "webos",
    category: "Internal Product",
    shortDescription:
      "Internal Aster platform for generating and operating client websites. In development.",
    fullDescription:
      "An internal Aster product for building and operating websites for clients, covering site generation, publishing and business operations tooling. Still in development and not commercially available — listed here as studio work, not as a product you can buy today.",
    coverImage: null,
    gallery: [],
    projectUrl: null,
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    classification: "INTERNAL_PRODUCT" as const,
    status: "IN_PROGRESS" as const,
    order: 10,
  },
  {
    name: "CommerceOS",
    slug: "commerceos",
    category: "Internal Product",
    shortDescription:
      "Internal Aster platform for commerce operations — catalogue, orders, inventory and reporting. In development.",
    fullDescription:
      "An internal Aster product covering commerce operations: product and category management, inventory, orders, customers and operational reporting. Still in development and not commercially available.",
    coverImage: null,
    gallery: [],
    projectUrl: null,
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    classification: "INTERNAL_PRODUCT" as const,
    status: "IN_PROGRESS" as const,
    order: 11,
  },
];

async function seedCatalog() {
  let solutionCount = 0;

  for (const category of catalog) {
    const saved = await prisma.serviceCategory.upsert({
      where: { slug: category.slug },
      update: {
        code: category.code,
        name: category.name,
        tagline: category.tagline,
        description: category.description,
        icon: category.icon,
        order: Number(category.code),
        published: true,
      },
      create: {
        code: category.code,
        name: category.name,
        slug: category.slug,
        tagline: category.tagline,
        description: category.description,
        icon: category.icon,
        order: Number(category.code),
      },
    });

    for (const [index, solution] of category.solutions.entries()) {
      const data = {
        title: solution.title,
        description: solution.description,
        icon: solution.icon,
        active: true,
        order: Number(category.code) * 100 + index,
        categoryId: saved.id,
        outcome: solution.outcome,
        headline: solution.headline,
        problem: solution.problem,
        idealCustomer: solution.idealCustomer,
        capabilities: solution.capabilities,
        functionality: solution.functionality,
        useCases: solution.useCases,
        integrations: solution.integrations,
        scopeNotes: solution.scopeNotes,
        implementationNote: solution.implementationNote,
        commercialModel: solution.commercialModel,
        availability: solution.availability,
        priceLabel: solution.priceLabel ?? "Request a project estimate.",
        ctaLabel: solution.ctaLabel,
        previewImage: solution.previewImage ?? null,
        previewCaption: solution.previewCaption ?? null,
        featured: Boolean(solution.featured),
      };

      const savedSolution = await prisma.service.upsert({
        where: { slug: solution.slug },
        update: data,
        create: { ...data, slug: solution.slug },
      });

      // Regravada a cada execução — ver nota no topo do arquivo.
      await prisma.serviceFaq.deleteMany({ where: { serviceId: savedSolution.id } });
      for (const [faqIndex, faq] of solution.faqs.entries()) {
        await prisma.serviceFaq.create({
          data: {
            serviceId: savedSolution.id,
            question: faq.question,
            answer: faq.answer,
            order: faqIndex,
          },
        });
      }

      solutionCount += 1;
    }
  }

  await prisma.service.updateMany({
    where: { slug: { in: retiredServiceSlugs } },
    data: { active: false, categoryId: null },
  });

  return solutionCount;
}

async function main() {
  const solutionCount = await seedCatalog();

  for (const [index, entry] of homeFaq.entries()) {
    const existing = await prisma.faqEntry.findFirst({ where: { question: entry.question } });
    if (existing) {
      await prisma.faqEntry.update({
        where: { id: existing.id },
        data: { ...entry, order: index, published: true },
      });
    } else {
      await prisma.faqEntry.create({ data: { ...entry, order: index } });
    }
  }

  for (const project of [...portfolioProjects, ...internalProducts]) {
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
      contactEmail: "hello@aster.studio",
      instagramUrl: "https://instagram.com/aster.ops",
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

  console.log(
    `Seed: ${catalog.length} categories, ${solutionCount} solutions, ${homeFaq.length} FAQ entries, ` +
      `${portfolioProjects.length + internalProducts.length} portfolio projects.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
