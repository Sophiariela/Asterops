import { INSTAGRAM_URL, LINKEDIN_URL, SITE_NAME, SITE_URL } from '../config/site';

/**
 * Dados estruturados (JSON-LD).
 *
 * Regra que vale para tudo aqui: só campo verificável. Sem nota, sem
 * avaliação, sem preço e sem perfil social inventado — `sameAs` só aparece
 * quando existe URL confirmada em config/site.ts, e hoje não existe.
 *
 * O prerender grava esta tag no HTML estático, então o crawler lê o
 * JSON-LD sem precisar executar o React.
 */
function Script({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Conteúdo próprio e estático; não vem de entrada de usuário.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const sameAs = [INSTAGRAM_URL, LINKEDIN_URL].filter(Boolean);

  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.svg`,
        image: `${SITE_URL}/og/aster-cover.png`,
        description:
          'Plataforma para criar o site profissional do seu negócio, com modelos por setor, reservas e agendamentos, catálogo de produtos e apoio de IA na produção de conteúdo.',
        // Só entra se houver perfil confirmado.
        ...(sameAs.length ? { sameAs } : {}),
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: 'pt-BR',
      }}
    />
  );
}

/**
 * SoftwareApplication — só para produto que é mesmo uma aplicação.
 *
 * `offers` fica de fora: o preço por produto não está verificado, e
 * publicar preço errado em dado estruturado é pior que não publicar.
 */
export function SoftwareApplicationJsonLd({
  name,
  description,
  category = 'BusinessApplication',
  path,
}: {
  name: string;
  description: string;
  category?: string;
  path: string;
}) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name,
        description,
        applicationCategory: category,
        operatingSystem: 'Web',
        url: `${SITE_URL}${path}`,
        provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      }}
    />
  );
}
