import type { LucideIcon } from 'lucide-react';
import { CalendarCheck, Globe, Instagram, MapPin, MessageCircle, HelpCircle, ShoppingBag, Layers, ShoppingCart, UserCircle, Sparkles } from 'lucide-react';

/**
 * Projetos reais entregues com a ASTER.
 *
 * Só entra aqui projeto que está no ar e pode ser aberto pelo visitante — o
 * screenshot é captura da página real (scripts/capture-portfolio.mjs), não
 * mockup. Nada de cliente inventado, logo emprestado ou número de resultado
 * que não dá para comprovar.
 */
export interface PortfolioFeature {
  label: string;
  icon: LucideIcon;
}

export interface PortfolioProject {
  slug: string;
  name: string;
  url: string;
  category: string;
  /** Categoria do site que este projeto exemplifica (ver Segments). */
  segment: string;
  shortDescription: string;
  description: string;
  image: string;
  /** Alt da imagem — descreve o que aparece, não só o nome do projeto. */
  imageAlt: string;
  features: PortfolioFeature[];
}

export const PORTFOLIO: PortfolioProject[] = [
  {
    slug: 'good-vibes-vaa',
    name: "Good Vibes Va'a",
    url: 'https://goodvibesvaa.vercel.app/',
    category: 'Serviços Locais / Esporte e Bem-estar',
    segment: 'Serviços locais',
    shortDescription:
      'Clube de canoa havaiana em Salvador, com passeios, aulas e reservas direto pelo site.',
    description:
      'Clube de canoa havaiana na Praia da Preguiça, em Salvador (BA). O site apresenta passeios de nascer e pôr do sol, aulas para iniciantes, treinos com Gympass e TotalPass e remadas particulares, com reservas e contato direto pelo WhatsApp.',
    image: '/portfolio/good-vibes-vaa.webp',
    imageAlt:
      "Página inicial do site Good Vibes Va'a: foto de remadores em canoa havaiana na Baía de Todos-os-Santos, com o título “Reme!” e botões de reservar passeio e falar com a equipe.",
    features: [
      { label: 'Sistema de reservas', icon: CalendarCheck },
      { label: 'Integração com WhatsApp', icon: MessageCircle },
      { label: 'Instagram', icon: Instagram },
      { label: 'Português e inglês', icon: Globe },
      { label: 'Mapa', icon: MapPin },
      { label: 'FAQ', icon: HelpCircle },
    ],
  },
  {
    slug: 'fulo-croche',
    name: 'FULÔ — Crochê Contemporâneo',
    url: 'https://fulo-crochet-site.onrender.com/',
    category: 'Varejo / Moda Autoral',
    segment: 'Varejo',
    shortDescription:
      'Marca de moda praia em crochê feito à mão, com catálogo, coleções e carrinho.',
    description:
      'Marca de moda praia em crochê feita à mão, com coleções autorais, catálogo de produtos, preços e lançamentos para clientes de todo o Brasil.',
    image: '/portfolio/fulo-croche.webp',
    imageAlt:
      'Página inicial da loja FULÔ: modelo usando top de crochê artesanal, com o nome da marca, a chamada da Coleção Amazônia e o menu da loja com carrinho e conta de cliente.',
    features: [
      { label: 'Catálogo de produtos', icon: ShoppingBag },
      { label: 'Coleções', icon: Layers },
      { label: 'Carrinho', icon: ShoppingCart },
      { label: 'Conta de cliente', icon: UserCircle },
      { label: 'Lançamentos', icon: Sparkles },
    ],
  },
];

export function getPortfolioBySegment(segment: string): PortfolioProject | undefined {
  return PORTFOLIO.find((p) => p.segment.toLowerCase() === segment.toLowerCase());
}
