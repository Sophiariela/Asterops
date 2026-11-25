import { useEffect } from 'react';
import { SITE_NAME, SITE_URL } from '../config/site';

/**
 * Metadata por rota numa SPA.
 *
 * Importante entender o limite: isto roda no cliente, depois do JS. Crawler
 * moderno executa JS e enxerga, mas o HTML inicial continua sendo o do
 * index.html — por isso o build também pré-renderiza as rotas públicas
 * (ver scripts/prerender.mjs), e é de lá que vem o ganho real de SEO.
 * Este hook mantém título e descrição corretos durante a navegação no
 * cliente, que o prerender sozinho não cobre.
 */
export interface PageMeta {
  title: string;
  description: string;
  /** Caminho começando com "/" — vira canonical e og:url. */
  path: string;
  image?: string;
}

const DEFAULT_IMAGE = '/og/aster-cover.png';

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    document.head.appendChild(el);
  }
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function applyPageMeta({ title, description, path, image = DEFAULT_IMAGE }: PageMeta) {
  const url = `${SITE_URL}${path}`;
  const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  document.title = title;
  upsertMeta('meta[name="description"]', { name: 'description', content: description });
  upsertLink('canonical', url);

  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url });
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: absoluteImage });
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
  upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'pt_BR' });

  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: absoluteImage });
}

export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    applyPageMeta(meta);
    // Dependências explícitas: o objeto literal muda a cada render.
  }, [meta.title, meta.description, meta.path, meta.image]);
}
