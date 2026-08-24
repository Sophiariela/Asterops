import {
  BarChart3,
  Bot,
  ClipboardList,
  CreditCard,
  Database,
  Globe,
  LineChart,
  Plug,
  Repeat,
  RefreshCw,
  Rocket,
  Search,
  ShoppingCart,
  Sparkles,
  Target,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import type { Product } from "@/types";

export const products: Product[] = [
  {
    slug: "website-os",
    name: "WebOS",
    shortDescription: "Digital presence infrastructure.",
    tagline: "Professional websites, digital experiences, lead generation, and the credibility to be taken seriously.",
    icon: Globe,
    homeCard: {
      previewImage: "/examples/website-os-1.png",
      capabilities: ["Premium websites", "Brand experience", "SEO foundation", "Lead capture"],
      outcome: "More credibility. More qualified leads.",
    },
    hero: {
      eyebrow: "WebOS",
      headline: "The infrastructure behind every customer interaction.",
      description:
        "WebOS is the digital presence layer of your business — a premium website, brand experience and lead capture, engineered as a system that converts, not a brochure that sits still.",
    },
    problem: {
      title: "Most digital presences are dead weight",
      description:
        "A website that doesn't convert, a brand that doesn't hold together, an experience that stops at the homepage — most businesses are carrying digital assets that cost money without producing customers.",
      points: [
        "Visitors leave without a clear next step",
        "The site says nothing about why you're worth trusting",
        "Every update means waiting on a freelancer or fighting a page builder",
      ],
    },
    solution: {
      title: "A system engineered to convert, not just exist",
      description:
        "WebOS gives you a premium website and customer journey built on real infrastructure — designed around the outcome you actually need: customers.",
      points: [
        "Every page is built around a conversion path, not just a layout",
        "SEO foundations and lead capture are built in from day one",
        "Your team can evolve the experience without commissioning a rebuild",
      ],
    },
    features: [
      { icon: Globe, title: "Premium websites", description: "High-performance, design-led sites built to represent the business you're becoming, not the one you started as." },
      { icon: Sparkles, title: "Brand experience", description: "A digital identity that carries the same weight as the business behind it." },
      { icon: Search, title: "SEO foundation", description: "Structure, performance and content built so search engines find you and rank you." },
      { icon: Rocket, title: "Landing pages", description: "Campaign and launch pages that ship fast and are built to convert from day one." },
      { icon: Target, title: "Lead capture", description: "Forms, journeys and calls to action engineered to turn visitors into pipeline." },
      { icon: BarChart3, title: "Analytics", description: "Understand what's actually driving traffic, conversion and revenue." },
    ],
    benefits: [
      { title: "A digital presence that earns its keep", description: "Every page and journey is built around turning visitors into customers." },
      { title: "Real infrastructure, not a template", description: "Built to represent where your business is going, not what you could afford at launch." },
      { title: "Your team can keep it moving", description: "Content and campaigns ship without a developer on standby." },
      { title: "The foundation for everything else", description: "WebOS is the layer CommerceOS, GrowthOS and OperationsOS connect to as you grow." },
    ],
    faq: [
      { question: "Can WebOS replace my existing website?", answer: "Yes. We map your existing content and structure into the new system during onboarding, so you launch on stronger infrastructure without losing what you've already built." },
      { question: "How is this different from hiring a web design agency?", answer: "An agency hands off a finished project and moves on. WebOS is infrastructure we build with you and that your team can keep evolving — and it's designed to connect with CommerceOS and GrowthOS as you grow." },
      { question: "Do I need technical skills to update content?", answer: "No. Content and pages are managed through configuration, not code — our team handles the underlying system." },
      { question: "What if I later need e-commerce?", answer: "WebOS and CommerceOS share the same underlying platform, so adding a store later doesn't mean starting over." },
    ],
    examples: [
      { title: "Marketing homepage", description: "The conversion path a first-time visitor follows.", image: "/examples/website-os-2.png" },
      { title: "Lead capture flow", description: "Forms and journeys built to turn visits into pipeline.", image: "/examples/website-os-3.png" },
    ],
    cta: {
      title: "Ready to build infrastructure that earns customers?",
      description: "Launch a digital presence engineered to convert, not just exist.",
      primaryCta: { label: "Build my system", href: "/contact" },
      secondaryCta: { label: "Explore Solutions", href: "/products" },
    },
  },
  {
    slug: "commerce-os",
    name: "CommerceOS",
    shortDescription: "Commerce infrastructure for modern brands.",
    tagline: "E-commerce, payments, customer journeys, catalog management, and online sales built as one system.",
    icon: ShoppingCart,
    homeCard: {
      previewImage: "/examples/commerce-os-1.png",
      capabilities: ["E-commerce platforms", "Payment integrations", "Catalog management", "Customer journeys"],
      outcome: "More sales. Fewer abandoned carts.",
    },
    hero: {
      eyebrow: "CommerceOS",
      headline: "Commerce infrastructure for modern brands.",
      description:
        "CommerceOS is the sales layer of your business — catalog, checkout, payments and customer journeys, engineered as one connected system built for real sales volume, not a plugin stack held together with hope.",
    },
    problem: {
      title: "Most stores don't sync, they leak",
      description:
        "A store that doesn't sync, a checkout that loses customers at the last step, an experience that stops before the sale — most businesses are carrying commerce tools that cost money without producing revenue.",
      points: [
        "Store, payments and content live in disconnected tools",
        "Customers abandon carts in a checkout that wasn't built for them",
        "Every catalog or pricing change means a support ticket to someone else",
      ],
    },
    solution: {
      title: "A system engineered to sell, not just list products",
      description:
        "CommerceOS gives you a storefront, checkout and customer journey built on shared infrastructure — designed around the outcome you actually need: completed orders.",
      points: [
        "Catalog, payments and content run on one connected system",
        "Checkout is built around your actual customers, not a generic template",
        "Your team can evolve pricing and catalog without commissioning a rebuild",
      ],
    },
    features: [
      { icon: ShoppingCart, title: "E-commerce platforms", description: "Catalog, checkout and inventory unified into one system built for real sales volume." },
      { icon: CreditCard, title: "Payment integrations", description: "Checkout and billing wired in from the start — no bolted-on plugins." },
      { icon: Database, title: "Catalog management", description: "Products, variants and inventory that stay in sync everywhere they're sold." },
      { icon: Sparkles, title: "Customer journeys", description: "Journeys designed end to end, from first visit to repeat customer." },
      { icon: Repeat, title: "Subscriptions & bundles", description: "Recurring revenue and bundled offers, built into checkout rather than bolted on." },
      { icon: BarChart3, title: "Commerce analytics", description: "Understand what's actually driving conversion, AOV and repeat purchases." },
    ],
    benefits: [
      { title: "A store that earns its keep", description: "Every product page and checkout step is built around turning visitors into orders." },
      { title: "One system, not five tools stitched together", description: "Storefront, catalog and payments share the same infrastructure and data." },
      { title: "Built to represent where you're going", description: "Premium design and engineering that scales with order volume, not a template you'll outgrow in a year." },
      { title: "Your team can keep it moving", description: "Catalog and pricing changes ship without a developer on standby." },
    ],
    faq: [
      { question: "Can CommerceOS replace my existing store?", answer: "Yes. We map your existing catalog and customer data into the new system during onboarding, so you launch on stronger infrastructure without losing what you've already built." },
      { question: "Is this a template store I'm buying?", answer: "No — Aster does not sell templates. Every CommerceOS build is designed and engineered for one business, the way Fulô Crochet's storefront was." },
      { question: "How is this different from a generic e-commerce platform?", answer: "CommerceOS is built into the rest of your Aster infrastructure — catalog, checkout and customer data share a system with WebOS and GrowthOS instead of operating as an isolated store." },
      { question: "Do I need technical skills to update products or pricing?", answer: "No. Catalog, pricing and content are managed through configuration, not code — our team handles the underlying system." },
    ],
    examples: [
      { title: "Storefront & catalog", description: "Product discovery built for browsing, not just search.", image: "/examples/commerce-os-2.png" },
      { title: "Checkout flow", description: "A checkout designed around the customer, not the platform default.", image: "/examples/commerce-os-3.png" },
    ],
    cta: {
      title: "Ready to build a store that actually converts?",
      description: "Launch commerce infrastructure engineered to sell, not just exist.",
      primaryCta: { label: "Build my system", href: "/contact" },
      secondaryCta: { label: "Explore Solutions", href: "/products" },
    },
  },
  {
    slug: "launch-os",
    name: "LaunchOS",
    shortDescription: "Launch faster. Validate smarter.",
    tagline: "MVPs, startup platforms, validation systems, and launch-ready products that reach real customers.",
    icon: Rocket,
    homeCard: {
      previewImage: "/examples/launch-os-1.png",
      capabilities: ["MVP development", "Startup platforms", "Validation systems", "Launch-ready builds"],
      outcome: "From idea to live in weeks, not quarters.",
    },
    hero: {
      eyebrow: "LaunchOS",
      headline: "Launch faster. Validate smarter.",
      description:
        "LaunchOS takes a new idea from concept to a live product in front of real customers — an MVP built as real infrastructure, engineered to prove the idea works before you over-invest in it.",
    },
    problem: {
      title: "Most launches take quarters, not weeks",
      description:
        "The gap between an idea and a live product is usually filled with scope creep, indecision, and infrastructure built for a scale you haven't reached yet — by the time it ships, the market has moved on.",
      points: [
        "Nothing is live, so nothing gets validated",
        "Scope keeps growing before the first version ever ships",
        "What gets built is over-engineered for a business that doesn't exist yet",
      ],
    },
    solution: {
      title: "A system engineered to prove the idea, fast",
      description:
        "LaunchOS gives you the smallest sellable version of your idea, built on real infrastructure so what you validate is what you keep — not a throwaway prototype.",
      points: [
        "Scope is set around what proves the idea, not everything you can imagine",
        "The MVP is built on the same infrastructure a scaled business runs on",
        "What you launch with is what you grow from, not what you replace",
      ],
    },
    features: [
      { icon: Rocket, title: "MVP development", description: "The smallest version of your product that proves the idea, built to production standards." },
      { icon: ClipboardList, title: "Startup platforms", description: "The core product, account system and customer flows a new business needs to operate." },
      { icon: Target, title: "Validation systems", description: "Instrumentation built in from day one, so you know what's working before you scale it." },
      { icon: Zap, title: "Launch-ready builds", description: "A version 1 built to actually ship — and to survive contact with real customers." },
      { icon: Globe, title: "Landing & waitlist pages", description: "Pre-launch pages that start building an audience before the product is live." },
      { icon: BarChart3, title: "Early analytics", description: "Signal on adoption and usage from day one, not months after launch." },
    ],
    benefits: [
      { title: "Live in weeks, not quarters", description: "A scoped MVP that ships fast enough to still matter when it does." },
      { title: "Built on real infrastructure", description: "What you launch with is what you scale from — not a prototype you rebuild later." },
      { title: "Validate before you over-invest", description: "Real usage data before committing to the next phase of the build." },
      { title: "A straight line to GrowthOS and OperationsOS", description: "Once the idea is proven, the rest of the Aster system is already there to scale it." },
    ],
    faq: [
      { question: "What exactly counts as an MVP here?", answer: "The smallest version of your product that lets real customers use it and lets you learn whether the idea works — scoped with you, not handed to you as a fixed template." },
      { question: "Will I have to rebuild this once it's validated?", answer: "No. LaunchOS is built on the same infrastructure the rest of Aster runs on, so a validated MVP becomes the foundation you grow, not a prototype you throw away." },
      { question: "How fast can something actually go live?", answer: "Timelines depend on scope, but LaunchOS is built around days and weeks from configuration to a live system, not quarters." },
      { question: "What happens after launch?", answer: "Once there's real usage, GrowthOS and OperationsOS connect directly to LaunchOS — you add analytics or automation without a separate integration project." },
    ],
    examples: [
      { title: "Product walkthrough", description: "The core flow a first customer sees on day one.", image: "/examples/launch-os-2.png" },
      { title: "Waitlist & launch page", description: "Building an audience before the product goes live.", image: "/examples/launch-os-3.png" },
    ],
    cta: {
      title: "Ready to get your idea in front of real customers?",
      description: "Launch the smallest sellable version of what you're building — built to keep, not to throw away.",
      primaryCta: { label: "Build my system", href: "/contact" },
      secondaryCta: { label: "Explore Solutions", href: "/products" },
    },
  },
  {
    slug: "growth-os",
    name: "GrowthOS",
    shortDescription: "Turn the data your business already has into clear decisions.",
    tagline: "Analytics, CRM, dashboards, and customer intelligence, so decisions stop being instinct.",
    icon: BarChart3,
    homeCard: {
      previewImage: "/examples/growth-os-1.png",
      capabilities: ["Analytics dashboards", "CRM systems", "Customer intelligence", "AI-driven insights"],
      outcome: "Clearer decisions. Faster growth.",
    },
    hero: {
      eyebrow: "GrowthOS",
      headline: "Stop guessing. Start deciding with data.",
      description:
        "GrowthOS turns the data scattered across your website, store and operations into AI dashboards, automated reports and growth insight — so decisions are based on what's actually happening, not a gut feeling.",
    },
    problem: {
      title: "Most businesses have data, not insight",
      description:
        "Numbers exist in five different tools, nobody has time to pull them together, and by the time a report is built, the moment to act on it has passed.",
      points: [
        "Reporting means manually pulling numbers together every week",
        "Data lives in disconnected tools that don't talk to each other",
        "Decisions get made on instinct because the numbers aren't accessible",
      ],
    },
    solution: {
      title: "Data that's always ready to act on",
      description:
        "GrowthOS unifies your data into live dashboards and automated reporting, so growth decisions are backed by what's actually happening in the business.",
      points: [
        "One dashboard for revenue, traffic, operations and pipeline",
        "Reports generate and deliver themselves, not compiled by hand",
        "AI surfaces what's changing and what it means, not just raw numbers",
      ],
    },
    features: [
      { icon: BarChart3, title: "AI dashboards", description: "Revenue, traffic and operations in one live view, not five disconnected tabs." },
      { icon: LineChart, title: "Business analytics", description: "Understand what's actually driving growth, not just what happened last month." },
      { icon: RefreshCw, title: "Automated reports", description: "Reporting that generates and delivers itself on schedule, not compiled by hand." },
      { icon: Target, title: "Growth insights", description: "AI-surfaced signals on what's changing and where to focus next." },
      { icon: Database, title: "Unified data", description: "Website, commerce and operations data connected into a single source of truth." },
      { icon: Search, title: "Anomaly detection", description: "Get flagged when something meaningfully changes, instead of finding out weeks later." },
    ],
    benefits: [
      { title: "Decisions backed by data, not instinct", description: "Every key number is visible in real time, not compiled from memory." },
      { title: "Hours back every week", description: "Automated reporting replaces the manual pull-together-the-numbers ritual." },
      { title: "See problems before they're expensive", description: "Anomalies and shifts get surfaced early, not discovered at quarter-end." },
      { title: "One source of truth for the whole team", description: "Everyone works from the same numbers instead of five different exports." },
    ],
    faq: [
      { question: "What data sources can GrowthOS connect to?", answer: "Your WebOS and CommerceOS data connect natively; external tools and existing platforms can be integrated during onboarding." },
      { question: "Do I need a data team to use this?", answer: "No. Dashboards and reports are built and configured by our team — your team just reads the insight and acts on it." },
      { question: "How is this different from a generic BI tool?", answer: "GrowthOS is built to sit on top of the rest of your Aster infrastructure, so dashboards reflect your actual website, commerce and automation data without a separate integration project." },
      { question: "Can I get alerts instead of checking a dashboard?", answer: "Yes — automated reports and anomaly alerts can be delivered on the schedule and channel that fits your team." },
    ],
    examples: [
      { title: "Revenue dashboard", description: "Revenue, traffic and operations in one live view.", image: "/examples/growth-os-2.png" },
      { title: "Automated report", description: "A report that generates and delivers itself on schedule.", image: "/examples/growth-os-3.png" },
    ],
    cta: {
      title: "Ready to see what's actually happening in your business?",
      description: "Replace scattered spreadsheets with one system that tells you what to do next.",
      primaryCta: { label: "Build my system", href: "/contact" },
      secondaryCta: { label: "Explore Solutions", href: "/products" },
    },
  },
  {
    slug: "operations-os",
    name: "OperationsOS",
    shortDescription: "AI systems that run the busywork so your team doesn't have to.",
    tagline: "AI assistants, workflow automation, and internal systems that absorb the repetitive work.",
    icon: Workflow,
    homeCard: {
      previewImage: "/examples/operations-os-1.png",
      capabilities: ["AI assistants", "Workflow automation", "Internal portals", "Process management"],
      outcome: "Less manual work. More capacity to scale.",
    },
    hero: {
      eyebrow: "OperationsOS",
      headline: "Give your business an AI-powered team that never sleeps.",
      description:
        "OperationsOS replaces manual follow-up, repetitive support and disconnected workflows with AI assistants and automation that run in the background — so growth doesn't depend on someone remembering to do it.",
    },
    problem: {
      title: "Manual work is a ceiling on growth",
      description:
        "The busier a business gets, the more that depends on someone manually following up, answering the same questions, and moving information between tools by hand.",
      points: [
        "Leads and customers wait on replies that come whenever someone has time",
        "The same support questions get answered manually, over and over",
        "Internal workflows live in someone's head, not in a system",
      ],
    },
    solution: {
      title: "Automation and AI that actually run the work",
      description:
        "OperationsOS puts AI assistants, qualification and workflow automation to work across support, sales and operations, with clear handoffs to your team where it matters.",
      points: [
        "AI assistants handle first response, qualification and routine support",
        "Booking, follow-up and lead qualification run without manual intervention",
        "Your CRM and internal tools stay in sync automatically",
      ],
    },
    features: [
      { icon: Bot, title: "AI assistants", description: "Conversational AI that handles first response, FAQs and qualification around the clock." },
      { icon: Users, title: "Customer support automation", description: "Common questions get resolved instantly, freeing your team for the ones that need a human." },
      { icon: Target, title: "Lead qualification", description: "Every lead gets scored and routed automatically, so nothing sits waiting." },
      { icon: ClipboardList, title: "Internal portals", description: "Dashboards and tools your team actually uses, built around how you work." },
      { icon: Workflow, title: "Workflow automation", description: "Approvals, handoffs and routine processes run on structured automation, not memory." },
      { icon: Plug, title: "CRM integrations", description: "Automation connects to the CRM and tools you already run the business on." },
    ],
    benefits: [
      { title: "Nothing falls through the cracks", description: "Every lead and customer gets a consistent, immediate response — automatically." },
      { title: "Growth without proportional headcount", description: "Automation absorbs the repetitive work so your team focuses on what needs judgment." },
      { title: "Support that scales with demand", description: "AI assistants handle volume spikes without hiring ahead of them." },
      { title: "One connected system, not five point tools", description: "Automation, CRM and support work off the same data, not separate spreadsheets." },
    ],
    faq: [
      { question: "Will an AI assistant replace my support team?", answer: "No — it handles the repetitive first line of support and qualification so your team spends time on the conversations that actually need a person." },
      { question: "Can OperationsOS connect to the CRM we already use?", answer: "Yes. Automation is built to sync with common CRMs rather than replace them, so your existing sales workflow stays intact." },
      { question: "Do I need to redesign our processes before automating them?", answer: "No. We map your current process first, then automate it — most businesses refine the process as part of the build, not before it." },
      { question: "How is this different from a generic chatbot tool?", answer: "OperationsOS is built into the rest of your Aster infrastructure — assistants, qualification and workflows share data with WebOS, CommerceOS and GrowthOS instead of operating as an isolated tool." },
    ],
    examples: [
      { title: "AI assistant handoff", description: "First response and qualification handled automatically.", image: "/examples/operations-os-2.png" },
      { title: "Internal workflow", description: "Approvals and routine processes running on structured automation.", image: "/examples/operations-os-3.png" },
    ],
    cta: {
      title: "Ready to put your busywork on autopilot?",
      description: "Let AI and automation handle what's currently depending on manual follow-up.",
      primaryCta: { label: "Build my system", href: "/contact" },
      secondaryCta: { label: "Explore Solutions", href: "/products" },
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductSlugs(): string[] {
  return products.map((product) => product.slug);
}
