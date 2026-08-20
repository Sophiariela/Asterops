import {
  BarChart3,
  Blocks,
  Bot,
  Briefcase,
  Building2,
  Compass,
  GraduationCap,
  Globe,
  Rocket,
  ShieldCheck,
  ShoppingCart,
  Store,
  Users,
  Workflow,
} from "lucide-react";
import type { AboutContent, ContactContent, HomeContent } from "@/types";

export const aboutContent: AboutContent = {
  hero: {
    eyebrow: "About",
    headline: "We build the systems ambitious businesses run on.",
    description:
      "Aster is a digital systems studio. We design and build the technology infrastructure — websites, commerce, automation, intelligence — that helps entrepreneurs attract customers, automate operations, and scale without stitching together a dozen disconnected tools.",
  },
  mission: {
    eyebrow: "Our Approach",
    title: "Systems that keep working, not projects that ship once.",
    description:
      "Most businesses end up with a graveyard of one-off builds — a site from one freelancer, automation from another tool, reporting nobody trusts. We think that's backwards. Aster is built around a single idea: intelligent systems, sharing infrastructure, designed to keep compounding value long after launch day.",
  },
  principles: [
    { icon: Blocks, title: "Systems, not one-off projects", description: "Every solution is built as real infrastructure, not a bespoke deliverable handed off and forgotten." },
    { icon: Bot, title: "AI-powered by default", description: "Automation and intelligence aren't an upsell — they're built into how we design every system from day one." },
    { icon: Building2, title: "Built for the long run", description: "We design for what your business looks like in three years, not just at launch." },
    { icon: ShieldCheck, title: "Enterprise-grade foundations", description: "Security, performance and reliability are default requirements, not upsells." },
  ],
  closingCta: {
    title: "Building something that needs real infrastructure?",
    description: "Let's talk about which Aster systems fit where your business is today.",
    primaryCta: { label: "Get in Touch", href: "/contact" },
    secondaryCta: { label: "Explore Solutions", href: "/products" },
  },
};

export const contactContent: ContactContent = {
  hero: {
    eyebrow: "Contact",
    headline: "Let's build your system.",
    description:
      "Tell us about your business and what's holding it back. We'll help you map that to the right Aster solution.",
  },
  // Contact details (email, Instagram) are sourced from `@/config/socials`
  // at render time — not duplicated here — so there is one source of truth.
  info: [{ label: "Response time", value: "Within one business day" }],
};

export const homeContent: HomeContent = {
  hero: {
    eyebrow: "Aster",
    headline: "Transform your business with intelligent digital systems.",
    subheadlineLines: [
      "From digital presence to AI-powered automation,",
      "Aster helps entrepreneurs build scalable businesses",
      "through software, design, and artificial intelligence.",
    ],
    primaryCta: { label: "Build my system", href: "/contact" },
    secondaryCta: { label: "Explore solutions", href: "/products" },
  },
  problems: {
    eyebrow: "Problems We Solve",
    title: "The real problems behind slow growth.",
    description: "Every business we work with is dealing with at least one of these — often all four.",
    items: [
      {
        icon: Workflow,
        problem: "My business depends too much on manual work.",
        solution: "AI automation, workflows, intelligent assistants.",
      },
      {
        icon: Globe,
        problem: "My online presence does not convert visitors into customers.",
        solution: "Premium websites, e-commerce, customer journeys.",
      },
      {
        icon: BarChart3,
        problem: "I have data but don't know how to use it.",
        solution: "AI analytics and business intelligence.",
      },
      {
        icon: Compass,
        problem: "I need technology but don't know where to start.",
        solution: "Digital strategy and implementation.",
      },
    ],
  },
  solutions: {
    eyebrow: "Aster Solutions",
    title: "Three systems. One mission: smarter businesses.",
    description:
      "Foundation, Automation and Intelligence — built to work together as the technology infrastructure behind your business.",
  },
  industries: {
    eyebrow: "Industries",
    title: "Built for ambitious businesses, not one niche.",
    description: "Different industries. Same mission: building smarter businesses.",
    items: [
      { icon: ShoppingCart, name: "E-commerce brands" },
      { icon: GraduationCap, name: "Education businesses" },
      { icon: Store, name: "Local businesses" },
      { icon: Rocket, name: "Startups" },
      { icon: Briefcase, name: "Professional services" },
      { icon: Users, name: "Communities" },
    ],
  },
  caseStudies: {
    eyebrow: "Case Studies",
    title: "Systems we've built.",
    description: "A look at how Aster infrastructure shows up in real businesses.",
    items: [
      { name: "Rowing School", description: "Digital enrollment, payment, scheduling and community system." },
      { name: "Startup", description: "AI-powered digital infrastructure." },
    ],
  },
  howItWorks: {
    eyebrow: "How Aster Works",
    title: "From decision to live system in four steps.",
    description: "A clear process, from first conversation to a system that scales with you.",
    steps: [
      { index: "01", title: "Discover", description: "We analyze your business challenges and where technology is actually holding you back." },
      { index: "02", title: "Design", description: "We create the digital strategy — the systems, priorities and sequence that fit your business." },
      { index: "03", title: "Build", description: "We develop the software, automation and AI systems that make up your infrastructure." },
      { index: "04", title: "Scale", description: "We improve the system continuously, using data and intelligence to guide what's next." },
    ],
  },
  finalCta: {
    title: "Your business deserves more than a website. It deserves a system.",
    description:
      "Talk to Aster about the infrastructure your business actually needs to attract customers, automate operations, and scale.",
    primaryCta: { label: "Start your transformation", href: "/contact" },
    secondaryCta: { label: "Explore Solutions", href: "/products" },
  },
};
