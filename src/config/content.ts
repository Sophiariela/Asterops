import type { AboutContent, CommercialModelCopy, ContactContent, HomeContent } from "@/types";

/**
 * Copy pública do site, em inglês.
 *
 * Catálogo, projetos e dúvidas vêm do banco; o que está aqui é a moldura
 * editorial das páginas. Texto do hero e rótulo de CTA têm versão editável
 * em `SiteSettings` (painel /admin/settings) — isto é o padrão de fábrica.
 */
export const homeContent: HomeContent = {
  hero: {
    eyebrow: "Digital Products & Software Studio",
    headline: "Digital products. Powerful software. Built around your business.",
    description:
      "Aster designs and develops websites, applications, business systems, and automation that turn complex needs into practical digital solutions.",
    primaryCta: { label: "Start a Project", href: "/contact" },
    secondaryCta: { label: "Explore Solutions", href: "/solutions" },
    proofCaption: "Shipped by Aster — Good Vibes Va’a and Fulô Crochet.",
  },

  whatWeBuild: {
    eyebrow: "What we build",
    title: "Four ways we build digital infrastructure.",
    description:
      "Every engagement starts from a business requirement, not from a template. These are the four areas the studio works in — each one has its own catalogue of defined solutions, plus room for custom scope.",
  },

  featured: {
    eyebrow: "Featured solutions",
    title: "Where most projects start.",
    description:
      "A selection of the solutions clients ask for most. Each one has a dedicated page explaining what it does, who it is for, and how it gets built.",
  },

  selectedWork: {
    eyebrow: "Selected work",
    title: "What the studio has shipped.",
    description:
      "Real projects, labelled for what they are — client work, internal product, or prototype. No invented clients, no borrowed logos, no performance numbers we cannot show you.",
  },

  process: {
    eyebrow: "Our process",
    title: "How a project actually runs.",
    description:
      "The same five stages whether we are building a landing page or a custom platform. What changes is the depth of each one, and that gets agreed in writing before development starts.",
    steps: [
      {
        step: "01",
        title: "Discovery",
        description:
          "We map how the business works today: the goal, the constraints, the people who will use the thing, and what is actually breaking.",
      },
      {
        step: "02",
        title: "Strategy & scope",
        description:
          "We define the solution, the feature set, and the technical approach — written down, with what is in scope and what is explicitly out of it.",
      },
      {
        step: "03",
        title: "Design & development",
        description:
          "Interface and engineering together: the product gets designed and built, with checkpoints you can see rather than a silent build phase.",
      },
      {
        step: "04",
        title: "Testing & launch",
        description:
          "Real flows get exercised before release — then deployment, domain and environment configuration, and handover with documentation.",
      },
      {
        step: "05",
        title: "Ongoing support",
        description:
          "Maintenance, monitoring and improvements, according to the agreement. Optional, and priced separately from the build.",
      },
    ],
  },

  whyAster: {
    eyebrow: "Why Aster",
    title: "A studio that commits to the scope it signs.",
    description:
      "No awards to cite and no invented statistics. What we can tell you is how the work is run.",
    items: [
      {
        title: "Built around real requirements",
        description:
          "The architecture follows the business process, not the other way around. If a requirement does not survive discovery, it does not get built.",
      },
      {
        title: "Technical decisions with a business reason",
        description:
          "Every choice — framework, database, hosting, integration — gets made against cost, maintenance burden and what the team can actually operate.",
      },
      {
        title: "Architecture you can extend",
        description:
          "Projects are structured so the next phase is an addition, not a rewrite. You can start with one piece and grow into the rest.",
      },
      {
        title: "A scope you can read",
        description:
          "Deliverables, exclusions, commercial model and timeline are written before development starts, so there is no argument about them later.",
      },
      {
        title: "Integrations treated honestly",
        description:
          "Anything depending on a third party — payment provider, WhatsApp Business Platform, an external API — is presented as scoped work, never as a feature that already exists.",
      },
      {
        title: "Support after handover",
        description:
          "The studio stays reachable once the project is live. Maintenance is a defined agreement, not a favour.",
      },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    title: "What clients ask before starting.",
    description:
      "If your question is not here, send it through the project form — you will get the same answer we would give on a call.",
  },

  finalCta: {
    title: "Have a project in mind?",
    description: "Tell us what you want to build. We’ll help define the right digital solution.",
    primaryCta: { label: "Start Your Project", href: "/contact" },
    secondaryCta: { label: "Explore Solutions", href: "/solutions" },
  },
};

export const aboutContent: AboutContent = {
  hero: {
    eyebrow: "About",
    headline: "A studio for the software a business actually runs on.",
    description:
      "Aster is a digital products and software studio. We combine product strategy, interface design and engineering to build the digital infrastructure behind modern businesses — from the website a customer sees to the system the team works in.",
  },
  mission: {
    eyebrow: "How we work",
    title: "You hire a team, not a platform.",
    description:
      "You describe the problem; we define the solution, build it, integrate it and put it into production. There is no toolkit to assemble yourself and no onboarding course — implementation is the service, not your homework.",
  },
  capabilities: [
    {
      title: "We build digital experiences",
      description:
        "Websites, landing pages, storefronts and web applications — designed to be used, and built to perform on real devices and real connections.",
    },
    {
      title: "We develop software products and business systems",
      description:
        "CRMs, booking systems, dashboards, workflow tools and inventory software, shaped around how a specific business operates.",
    },
    {
      title: "We automate and connect operations",
      description:
        "Workflow automation, API and system integrations, and AI-assisted tooling with a defined scope and a human escalation path.",
    },
  ],
  principles: [
    {
      title: "Outcome before technology",
      description:
        "The project starts at the operational problem, not at the stack we would enjoy using.",
    },
    {
      title: "Implementation is the service",
      description:
        "Configuring, integrating and deploying is part of the delivery — never handed back to the client.",
    },
    {
      title: "No promise outside the scope",
      description:
        "An integration that depends on external approval is presented as scoped work, never as a shipped feature.",
    },
    {
      title: "Built to be operated",
      description: "What we deliver has to survive daily use, not just look right on launch day.",
    },
  ],
  closingCta: {
    title: "Want to know what this would look like for your business?",
    description:
      "Tell us how the operation runs today. You get back a direction, a scope and a next step.",
    primaryCta: { label: "Start a Project", href: "/contact" },
    secondaryCta: { label: "See projects", href: "/projects" },
  },
};

export const contactContent: ContactContent = {
  hero: {
    eyebrow: "Start a project",
    headline: "Tell us what you want to build.",
    description:
      "The more concrete the problem — a website, a booking flow, a system your team lives in, an integration that keeps breaking — the more direct the answer. We reply within one business day.",
  },
  info: [
    { label: "Response", value: "Within one business day" },
    { label: "Engagements", value: "Remote, worldwide" },
    { label: "First step", value: "Discovery call, no cost" },
  ],
};

/**
 * Explicação de cada modelo comercial.
 *
 * O briefing proíbe cartão de preço mensal genérico para todo serviço: o
 * modelo depende do tipo de trabalho, e a página de cada solução diz qual é
 * o seu. Preço só aparece quando existe — não se inventa número.
 */
export const commercialModelCopy: Record<string, CommercialModelCopy> = {
  FIXED_SCOPE: {
    label: "Fixed-scope project",
    description:
      "Deliverables are defined up front and quoted as one project. Best when the requirement is clear enough to write down completely before we start.",
  },
  CUSTOM_QUOTE: {
    label: "Custom project quote",
    description:
      "Scope comes out of discovery, then gets quoted. Used where the feature set genuinely depends on how your business works.",
  },
  SETUP_PLUS_MAINTENANCE: {
    label: "Setup + recurring maintenance",
    description:
      "An implementation fee for the build, plus a recurring fee covering hosting, monitoring, support and any API usage the solution depends on.",
  },
  SUBSCRIPTION: {
    label: "Product subscription",
    description:
      "Only used for Aster software that is already operational and commercially available — never for work that still has to be developed.",
  },
};

/** Rótulos da regra de honestidade do catálogo. */
export const availabilityCopy: Record<string, { label: string; description: string }> = {
  OPERATIONAL_PRODUCT: {
    label: "Operational product",
    description: "Already built and running in production. Can be deployed and configured for you.",
  },
  CUSTOM_DEVELOPMENT: {
    label: "Custom development",
    description:
      "Built for your project. The studio has delivered this type of work, and each build is scoped from your requirements.",
  },
  DEMONSTRATION: {
    label: "Demonstration",
    description: "Shown here as a product demonstration. Not a deployed client system.",
  },
};
