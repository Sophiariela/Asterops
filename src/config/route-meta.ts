import type { PageMeta } from '../lib/meta';

/**
 * Título e descrição por rota pública.
 *
 * Fonte única: as páginas leem daqui, e o prerender captura o resultado já
 * aplicado no HTML — então não existe uma segunda cópia desses textos em
 * script de build.
 *
 * Descrição é específica por rota de propósito; descrição duplicada entre
 * páginas é tratada como erro de SEO.
 */
export const ROUTE_META: Record<string, PageMeta> = {
  home: {
    path: '/',
    title: 'ASTER — Crie o site profissional do seu negócio',
    description:
      'Plataforma para criar o site do seu negócio: modelos por setor, reservas e agendamentos reais, catálogo de produtos e a Luna AI ajudando a escrever o conteúdo.',
  },
  portfolio: {
    path: '/portfolio',
    title: 'Portfólio — sites reais feitos com a ASTER',
    description:
      'Projetos desenvolvidos para negócios reais com a ASTER: Good Vibes Va’a, clube de canoa havaiana em Salvador com reservas online, e FULÔ, loja de moda praia em crochê com catálogo e carrinho.',
  },
  plans: {
    path: '/plans',
    title: 'Planos e preços — ASTER',
    description:
      'Compare os planos da ASTER e escolha o que cabe na sua operação. Cobrança mensal ou anual, com as condições de domínio de cada plano descritas abertamente.',
  },
  ecosystem: {
    path: '/ecosystem',
    title: 'Ecossistema ASTER — produtos que funcionam juntos',
    description:
      'Como os sistemas da ASTER se conectam: site e reservas, catálogo e vendas, conteúdo com a Luna AI — tudo sobre a mesma base de dados do seu negócio.',
  },
};

/** Metadata de uma página de produto, montada a partir do próprio produto. */
export function productMeta(name: string, tagline: string, slug: string): PageMeta {
  return {
    path: `/products/${slug}`,
    title: `${name} — ${tagline} | ASTER`,
    description: `${name}: ${tagline} Faz parte do ecossistema ASTER, junto do site, das reservas e do catálogo do seu negócio.`,
  };
}

/** Metadata de uma página de solução. */
export function solutionMeta(name: string, tagline: string, slug: string): PageMeta {
  return {
    path: `/solutions/${slug}`,
    title: `${name} — ${tagline} | ASTER`,
    description: `${tagline} Solução ASTER para o seu negócio, com site, reservas e catálogo na mesma plataforma.`,
  };
}
