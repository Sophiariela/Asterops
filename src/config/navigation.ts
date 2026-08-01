import { contactEmail, instagramHandle, instagramUrl } from "@/config/socials";
import type { FooterColumn, NavLink } from "@/types";

export const headerNav: NavLink[] = [
  { label: "Solutions", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const headerCta: NavLink = {
  label: "Explore Solutions",
  href: "/products",
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Company",
    links: [{ label: "About", href: "/about" }],
  },
  {
    title: "Solutions",
    links: [
      { label: "All Solutions", href: "/products" },
      { label: "Aster Foundation", href: "/product/aster-foundation" },
      { label: "Aster Automation", href: "/product/aster-automation" },
      { label: "Aster Intelligence", href: "/product/aster-intelligence" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: contactEmail, href: `mailto:${contactEmail}` },
      { label: instagramHandle, href: instagramUrl },
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
