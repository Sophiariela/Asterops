import type { FooterColumn, NavLink } from "@/types";

export const headerNav: NavLink[] = [
  { label: "Soluções", href: "/solucoes" },
  { label: "Como funciona", href: "/como-funciona" },
  { label: "Projetos", href: "/projetos" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

export const headerCta: NavLink = {
  label: "Solicitar diagnóstico",
  href: "/contato",
};

export function buildFooterColumns(contactEmail: string): FooterColumn[] {
  return [
    {
      title: "Soluções",
      links: [
        { label: "O que implementamos", href: "/solucoes" },
        { label: "Níveis de solução", href: "/solucoes#niveis" },
        { label: "Como funciona", href: "/como-funciona" },
      ],
    },
    {
      title: "Estúdio",
      links: [
        { label: "Sobre a Aster", href: "/sobre" },
        { label: "Projetos", href: "/projetos" },
      ],
    },
    {
      title: "Contato",
      links: [
        { label: "Solicitar diagnóstico", href: "/contato" },
        { label: contactEmail, href: `mailto:${contactEmail}` },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacidade", href: "/legal/privacy" },
        { label: "Termos", href: "/legal/terms" },
      ],
    },
  ];
}
