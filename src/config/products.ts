import {
  BarChart3,
  Bot,
  ClipboardList,
  CreditCard,
  Database,
  Globe,
  LineChart,
  Plug,
  RefreshCw,
  Rocket,
  Search,
  ShoppingCart,
  Sparkles,
  Target,
  Users,
  Workflow,
} from "lucide-react";
import type { Product } from "@/types";

export const products: Product[] = [
  {
    slug: "aster-foundation",
    name: "Aster Foundation",
    shortDescription: "The digital infrastructure your business runs on.",
    tagline: "Websites, e-commerce and customer experience built as real infrastructure.",
    icon: Globe,
    hero: {
      eyebrow: "Aster Foundation",
      headline: "The infrastructure behind every customer interaction.",
      description:
        "Aster Foundation is the digital presence layer of your business — websites, e-commerce, payments and customer experience, engineered as a system that converts, not a brochure that sits still.",
    },
    problem: {
      title: "Most digital presences are dead weight",
      description:
        "A website that doesn't convert, a store that doesn't sync, an experience that stops at the homepage — most businesses are carrying digital assets that cost money without producing customers.",
      points: [
        "Visitors leave without a clear next step",
        "Store, payments and content live in disconnected tools",
        "Every update means waiting on a freelancer or fighting a page builder",
      ],
    },
    solution: {
      title: "A system engineered to convert, not just exist",
      description:
        "Aster Foundation gives you a premium website, storefront and customer journey built on shared infrastructure — designed around the outcome you actually need: customers.",
      points: [
        "Every page is built around a conversion path, not just a layout",
        "Catalog, payments and content run on one connected system",
        "Your team can evolve the experience without commissioning a rebuild",
      ],
    },
    features: [
      { icon: Globe, title: "Premium websites", description: "High-performance, design-led sites built to represent the business you're becoming, not the one you started as." },
      { icon: ShoppingCart, title: "E-commerce", description: "Catalog, checkout and inventory unified into one system built for real sales volume." },
      { icon: Rocket, title: "Landing pages", description: "Campaign and launch pages that ship fast and are built to convert from day one." },
      { icon: CreditCard, title: "Payments", description: "Checkout and billing wired in from the start — no bolted-on plugins." },
      { icon: BarChart3, title: "Analytics", description: "Understand what's actually driving traffic, conversion and revenue." },
      { icon: Sparkles, title: "Customer experience", description: "Journeys designed end to end, from first visit to repeat customer." },
    ],
    benefits: [
      { title: "A digital presence that earns its keep", description: "Every page, product and journey is built around turning visitors into customers." },
      { title: "One system, not five tools stitched together", description: "Website, store and payments share the same infrastructure and data." },
      { title: "Built to represent where you're going", description: "Premium design and engineering that scales with the business, not a template you'll outgrow in a year." },
      { title: "Your team can keep it moving", description: "Content and campaigns ship without a developer on standby." },
    ],
    faq: [
      { question: "Do I need both a website and e-commerce, or can I start with one?", answer: "Start with what your business needs today — a site, a store, or both. Aster Foundation is built so each piece shares the same infrastructure, so adding the other later doesn't mean starting over." },
      { question: "Can Aster Foundation replace my existing website or store?", answer: "Yes. We map your existing content, catalog and customer data into the new system during onboarding, so you launch on stronger infrastructure without losing what you've already built." },
      { question: "How is this different from hiring a web design agency?", answer: "An agency hands off a finished project and moves on. Aster Foundation is infrastructure we build with you and that your team can keep evolving — and it's designed to connect with Aster Automation and Aster Intelligence as you grow." },
      { question: "Do I need technical skills to update content or products?", answer: "No. Content, pages and catalog are managed through configuration, not code — our team handles the underlying system." },
    ],
    cta: {
      title: "Ready to build infrastructure that earns customers?",
      description: "Launch a digital presence engineered to convert, not just exist.",
      primaryCta: { label: "Build my system", href: "/contact" },
      secondaryCta: { label: "Explore Solutions", href: "/products" },
    },
  },
  {
    slug: "aster-automation",
    name: "Aster Automation",
    shortDescription: "AI systems that run the busywork so your team doesn't have to.",
    tagline: "AI assistants and workflows that make your business smarter.",
    icon: Bot,
    hero: {
      eyebrow: "Aster Automation",
      headline: "Give your business an AI-powered team that never sleeps.",
      description:
        "Aster Automation replaces manual follow-up, repetitive support and disconnected workflows with AI assistants and automation that run in the background — so growth doesn't depend on someone remembering to do it.",
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
        "Aster Automation puts AI assistants, qualification and workflow automation to work across support, sales and operations, with clear handoffs to your team where it matters.",
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
      { icon: ClipboardList, title: "Booking systems", description: "Scheduling and enrollment that runs itself, synced with your calendar and team." },
      { icon: Workflow, title: "Internal workflows", description: "Approvals, handoffs and routine processes run on structured automation, not memory." },
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
      { question: "Can Aster Automation connect to the CRM we already use?", answer: "Yes. Automation is built to sync with common CRMs rather than replace them, so your existing sales workflow stays intact." },
      { question: "Do I need to redesign our processes before automating them?", answer: "No. We map your current process first, then automate it — most businesses refine the process as part of the build, not before it." },
      { question: "How is this different from a generic chatbot tool?", answer: "Aster Automation is built into the rest of your Aster infrastructure — assistants, qualification and workflows share data with Aster Foundation and Aster Intelligence instead of operating as an isolated tool." },
    ],
    cta: {
      title: "Ready to put your busywork on autopilot?",
      description: "Let AI and automation handle what's currently depending on manual follow-up.",
      primaryCta: { label: "Build my system", href: "/contact" },
      secondaryCta: { label: "Explore Solutions", href: "/products" },
    },
  },
  {
    slug: "aster-intelligence",
    name: "Aster Intelligence",
    shortDescription: "Turn the data your business already has into clear decisions.",
    tagline: "AI dashboards and analytics that turn data into decisions.",
    icon: BarChart3,
    hero: {
      eyebrow: "Aster Intelligence",
      headline: "Stop guessing. Start deciding with data.",
      description:
        "Aster Intelligence turns the data scattered across your website, store and operations into AI dashboards, automated reports and growth insight — so decisions are based on what's actually happening, not a gut feeling.",
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
        "Aster Intelligence unifies your data into live dashboards and automated reporting, so growth decisions are backed by what's actually happening in the business.",
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
      { question: "What data sources can Aster Intelligence connect to?", answer: "Your Aster Foundation and Aster Automation data connect natively; external tools and existing platforms can be integrated during onboarding." },
      { question: "Do I need a data team to use this?", answer: "No. Dashboards and reports are built and configured by our team — your team just reads the insight and acts on it." },
      { question: "How is this different from a generic BI tool?", answer: "Aster Intelligence is built to sit on top of the rest of your Aster infrastructure, so dashboards reflect your actual website, commerce and automation data without a separate integration project." },
      { question: "Can I get alerts instead of checking a dashboard?", answer: "Yes — automated reports and anomaly alerts can be delivered on the schedule and channel that fits your team." },
    ],
    cta: {
      title: "Ready to see what's actually happening in your business?",
      description: "Replace scattered spreadsheets with one system that tells you what to do next.",
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
