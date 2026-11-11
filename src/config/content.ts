import type { AboutContent, ContactContent, HomeContent } from "@/types";

export const homeContent: HomeContent = {
  hero: {
    eyebrow: "Aster — Digital Development Studio",
    headline: "Digital solutions built around your business.",
    description:
      "From professional websites to custom software, Aster turns business needs into reliable digital products.",
    primaryCta: { label: "Start a Project", href: "/contact" },
    secondaryCta: { label: "Explore Our Work", href: "/portfolio" },
  },
  servicesPreview: {
    eyebrow: "Services",
    title: "What we build.",
    description: "Websites, software, and the systems that run your business — each one scoped to what you actually need.",
  },
  portfolioPreview: {
    eyebrow: "Our Work",
    title: "Recent projects.",
    description: "A look at what we've built for real businesses.",
  },
  finalCta: {
    title: "Let's build something meaningful.",
    description: "Tell us about your project. We'll review your requirements and get back to you with the next steps.",
    primaryCta: { label: "Start a Project", href: "/contact" },
    secondaryCta: { label: "Explore Our Work", href: "/portfolio" },
  },
};

export const aboutContent: AboutContent = {
  hero: {
    eyebrow: "About",
    headline: "Technology with purpose. Development with direction.",
    description:
      "Aster combines strategy, design, and engineering to create digital solutions tailored to each client's needs. We're not a template marketplace or a page builder — you tell us what your business needs, and our team designs and builds it.",
  },
  mission: {
    eyebrow: "How we work",
    title: "You hire a studio, not a self-serve tool.",
    description:
      "You contact us, explain what you need, and receive a proposal. From there, our team designs and develops the solution — a website, a piece of software, a dashboard — built around your business, not assembled from a template.",
  },
  principles: [
    { title: "Custom, not templated", description: "Every project is scoped and built around the business it serves." },
    { title: "Technical and creative", description: "Engineering, design, and brand strategy work together on every build." },
    { title: "Reliable infrastructure", description: "What we ship is built to run your business, not just to launch once." },
    { title: "Personalized service", description: "You work directly with the team building your project, start to finish." },
  ],
  closingCta: {
    title: "Building something that needs real development?",
    description: "Tell us about your project and we'll get back to you with next steps.",
    primaryCta: { label: "Start a Project", href: "/contact" },
    secondaryCta: { label: "Explore Our Work", href: "/portfolio" },
  },
};

export const contactContent: ContactContent = {
  hero: {
    eyebrow: "Contact",
    headline: "Let's build something meaningful.",
    description: "Tell us about your project. We'll review your requirements and get back to you with the next steps.",
  },
  info: [{ label: "Response time", value: "Within one business day" }],
};
