import type { FooterColumn, NavLink } from "@/types";

export const headerNav: NavLink[] = [
  { label: "Solutions", href: "/solutions" },
  { label: "Projects", href: "/projects" },
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
      title: "Solutions",
      links: [
        { label: "Web & Digital Experience", href: "/solutions/web-digital-experience" },
        { label: "Business Software", href: "/solutions/business-software" },
        { label: "Automation & AI", href: "/solutions/automation-ai" },
        { label: "Custom Software", href: "/solutions/custom-software-development" },
      ],
    },
    {
      title: "Studio",
      links: [
        { label: "About Aster", href: "/about" },
        { label: "Projects", href: "/projects" },
        { label: "Our process", href: "/#process" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "Start a Project", href: "/contact" },
        { label: contactEmail, href: `mailto:${contactEmail}` },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/legal/privacy" },
        { label: "Terms", href: "/legal/terms" },
      ],
    },
  ];
}
