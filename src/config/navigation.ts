import type { FooterColumn, NavLink } from "@/types";

export const headerNav: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const headerCta: NavLink = {
  label: "Start a Project",
  href: "/contact",
};

export function buildFooterColumns(contactEmail: string): FooterColumn[] {
  return [
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Work", href: "/portfolio" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "All Services", href: "/services" },
        { label: "Start a Project", href: "/contact" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "Contact Us", href: "/contact" },
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
}
