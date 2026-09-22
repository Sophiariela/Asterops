import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, ApiError } from '../../lib/api';
import PublicSiteRenderer from '../../components/webos/PublicSiteRenderer';
import type { PublicSite } from '../../lib/webos/types';

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
    document.title = page?.seoTitle || `${site.businessName}${page ? ` — ${page.name}` : ''}`;
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

  return <PublicSiteRenderer site={site} page={page} siteSlug={site.slug ?? slug!} />;
}
