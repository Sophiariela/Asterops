import {
  Blocks,
  Bot,
  Briefcase,
  Building2,
  GraduationCap,
  Rocket,
  ShieldCheck,
  Shirt,
  Store,
  Users,
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
    eyebrow: "Operating systems for modern business",
    headline: "Build a smarter business.",
    subheadlineLines: [
      "Technology, automation, AI, and digital infrastructure — designed as one system, so growth stops depending on who remembers to do the work.",
    ],
    primaryCta: { label: "Find your growth system", href: "/diagnostic" },
    secondaryCta: { label: "Explore the systems", href: "/#systems" },
  },
  stats: [
    { value: "One", label: "Platform underneath all five systems — no duplicated infrastructure." },
    { value: "Days", label: "From configuration to a live system, not quarters." },
    { value: "5", label: "Operating systems, each addressing one part of the business." },
    { value: "99.98%", label: "Uptime target across deployed Aster infrastructure." },
  ],
  systems: {
    eyebrow: "Systems",
    title: "Five systems. One mission: smarter businesses.",
    description: "Each one addresses a different part of the business, built to work together as one platform.",
  },
  whyAster: {
    title: "A website is a page. A system is the business.",
    traditional: {
      label: "Traditional agency",
      items: [
        "Delivers pages, then moves on",
        "Priced by the project",
        "Limited infrastructure underneath",
        "Every change is a new engagement",
      ],
    },
    aster: {
      label: "Aster",
      items: [
        "Delivers systems that keep working",
        "Built for long-term growth",
        "Real business infrastructure",
        "Automation built in from day one",
        "AI integrated, not bolted on",
        "Scalable architecture across five systems",
      ],
    },
  },
  showcase: {
    kicker: "CommerceOS in production",
    title: "Built for modern commerce.",
    description:
      "A real-world example of a CommerceOS implementation — not a template, not a product for sale. Every Aster build is designed for one business.",
    facts: [
      { label: "Client", body: "Fulô Crochet — a handmade crochet studio scaling past direct messages." },
      { label: "System", body: "CommerceOS: storefront, checkout, inventory and customer accounts." },
      { label: "Highlights", body: "Custom checkout, subscription bundles, and a wholesale portal." },
      { label: "Outcome", body: "Higher average order value and materially lower cart abandonment." },
    ],
    primaryCta: { label: "View experience", href: "https://fulo-crochet-site.onrender.com/" },
    secondaryCta: { label: "Build something similar", href: "/contact" },
  },
  industries: {
    eyebrow: "Industries",
    title: "Different industries. Same mission.",
    description: "Built for ambitious businesses, not one niche.",
    items: [
      { icon: Store, name: "Retail" },
      { icon: Shirt, name: "Fashion" },
      { icon: GraduationCap, name: "Education" },
      { icon: Rocket, name: "Startups" },
      { icon: Briefcase, name: "Professional services" },
      { icon: Users, name: "Communities" },
    ],
  },
  process: {
    eyebrow: "Process",
    title: "From discovery to scale.",
    steps: [
      { index: "01", title: "Discover", description: "We analyze the business and find where technology is actually holding it back." },
      { index: "02", title: "Design", description: "We architect the system — the priorities, the sequence, the shape of it." },
      { index: "03", title: "Build", description: "We develop the software, automation and AI that make up your infrastructure." },
      { index: "04", title: "Automate", description: "We connect the workflows so the system runs without manual handoffs." },
      { index: "05", title: "Scale", description: "We improve continuously, using data to guide what comes next." },
    ],
  },
  trust: {
    title: "Built to earn trust at scale.",
    placeholders: [
      { glyph: "01", label: "Case studies" },
      { glyph: "02", label: "Testimonials" },
      { glyph: "03", label: "Project metrics" },
    ],
    trustedByLabel: "Trusted by teams building with Aster",
    clientPlaceholders: ["Client 01", "Client 02", "Client 03", "Client 04", "Client 05"],
  },
  finalCta: {
    title: "Your business deserves more than a website. It deserves a system.",
    description: "Build the digital infrastructure behind your next stage of growth.",
    primaryCta: { label: "Find your growth system", href: "/diagnostic" },
    secondaryCta: { label: "Talk to Aster", href: "/contact" },
  },
};
