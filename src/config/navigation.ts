import { contactEmail } from "@/config/socials";
import { products } from "@/config/products";
import type { FooterColumn, NavLink } from "@/types";

export const headerNav: NavLink[] = [
  { label: "Systems", href: "/#systems" },
  { label: "Showcase", href: "/#showcase" },
  { label: "Process", href: "/#process" },
  { label: "Contact", href: "/contact" },
];

export const headerCta: NavLink = {
  label: "Book a Consultation",
  href: "/contact",
};

export const clientLoginNav: NavLink = {
  label: "Client login",
  href: "/portal",
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Systems",
    links: products.map((product) => ({ label: product.name, href: `/product/${product.slug}` })),
  },
  {
    title: "Company",
    links: [
      { label: "Find your system", href: "/diagnostic" },
      { label: "Showcase", href: "/#showcase" },
      { label: "Design system", href: "/design-system" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Start a project", href: "/contact" },
      { label: "Client login", href: "/portal" },
      { label: contactEmail, href: `mailto:${contactEmail}` },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
    ],
  },
];
