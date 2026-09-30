import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, ApiError, resolveUploadUrl } from '../../lib/api';
import PublicSiteRenderer from '../../components/webos/PublicSiteRenderer';
import type { PublicSite } from '../../lib/webos/types';

const DEFAULT_DESCRIPTION = 'ASTER — O sistema completo do varejo, movido a IA. ERP, Hub de Integração, Ecommerce, PDV, Envios e Soluções Financeiras.';

// Sets (or clears, passing null) an og:/twitter: meta tag, creating the
// element on first use. Social platforms and link-unfurl bots read these
// directly from the served HTML's <head> — without them a shared link falls
// back to a bare URL with no title, description or image.
function setMetaTag(selector: string, attrs: Record<string, string>, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function PublicSitePage() {
  const { slug, pageSlug } = useParams<{ slug: string; pageSlug?: string }>();
  const [site, setSite] = useState<PublicSite | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setSite(null);
    setNotFound(false);
    api.get<{ site: PublicSite }>(`/webos/public/sites/${slug}`)
      .then((data) => setSite(data.site))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
      });
  }, [slug]);

  useEffect(() => {
    if (!site) return;
    const page = site.pages.find((p) => p.slug === pageSlug) ?? site.pages.find((p) => p.slug === 'home') ?? site.pages[0];
    const title = page?.seoTitle || `${site.businessName}${page ? ` | ${page.name}` : ''}`;
    const description = page?.seoDescription || site.industry;
    const image = resolveUploadUrl(page?.heroImageUrl ?? site.logoUrl);

    document.title = title;
    setMetaTag('meta[name="description"]', { name: 'description' }, description);
    setMetaTag('meta[property="og:title"]', { property: 'og:title' }, title);
    setMetaTag('meta[property="og:description"]', { property: 'og:description' }, description);
    setMetaTag('meta[property="og:type"]', { property: 'og:type' }, 'website');
    setMetaTag('meta[property="og:url"]', { property: 'og:url' }, window.location.href);
    setMetaTag('meta[property="og:image"]', { property: 'og:image' }, image);
    setMetaTag('meta[name="twitter:card"]', { name: 'twitter:card' }, image ? 'summary_large_image' : 'summary');
    setMetaTag('meta[name="twitter:title"]', { name: 'twitter:title' }, title);
    setMetaTag('meta[name="twitter:description"]', { name: 'twitter:description' }, description);
    setMetaTag('meta[name="twitter:image"]', { name: 'twitter:image' }, image);

    // Public site pages are the only place these should exist — reset to
    // the app's own defaults when navigating away so the rest of AsterOps
    // doesn't keep a stray business's title/image in its share preview.
    return () => {
      document.title = 'ASTER — O sistema completo do varejo, movido a IA';
      setMetaTag('meta[name="description"]', { name: 'description' }, DEFAULT_DESCRIPTION);
      ['og:title', 'og:description', 'og:type', 'og:url', 'og:image'].forEach((p) => setMetaTag(`meta[property="${p}"]`, { property: p }, null));
      ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'].forEach((n) => setMetaTag(`meta[name="${n}"]`, { name: n }, null));
    };
  }, [site, pageSlug]);

  // Fire-and-forget view beacon — powers the Site Views card on the Owner
  // Dashboard. Never blocks or affects rendering if it fails.
  useEffect(() => {
    if (!site) return;
    const page = site.pages.find((p) => p.slug === pageSlug) ?? site.pages.find((p) => p.slug === 'home') ?? site.pages[0];
    if (!page) return;
    api.post('/webos/public/views', { siteId: site.id, pageSlug: page.slug }).catch(() => {});
  }, [site, pageSlug]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="font-display font-extrabold text-2xl text-ink-900">This site isn't available</p>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">It may not be published yet, or the link may be incorrect.</p>
        <Link to="/" className="mt-6 text-sm font-bold text-ASTER-600 hover:text-ASTER-700">Go to AsterOps</Link>
      </div>
    );
  }

  if (!site) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">Loading…</div>;
  }

  const page = site.pages.find((p) => p.slug === pageSlug) ?? site.pages.find((p) => p.slug === 'home') ?? site.pages[0];

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="font-display font-extrabold text-2xl text-ink-900">This site has no pages yet</p>
      </div>
    );
  }

  if (pageSlug && page.slug !== pageSlug) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="font-display font-extrabold text-2xl text-ink-900">Page not found</p>
        <Link to={`/site/${site.slug}`} className="mt-6 text-sm font-bold text-ASTER-600 hover:text-ASTER-700">
          Go to {site.businessName}'s home page
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PublicSiteRenderer site={site} page={page} siteSlug={site.slug ?? slug!} />
    </div>
  );
}
