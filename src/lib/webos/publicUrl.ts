import type { Site } from './types';

// The public /site/:slug route is served by this same frontend app, so
// wherever it's actually running (a Vercel preview, the .vercel.app
// production alias, or a real custom domain later) is always the correct
// base — unlike a hardcoded domain, which can silently point nowhere if
// that domain was never actually attached to the deployment.
export function getPublicSiteUrl(site: Pick<Site, 'slug' | 'customDomain'>): string | null {
  if (site.customDomain) return `https://${site.customDomain}`;
  if (site.slug) return `${window.location.origin}/site/${site.slug}`;
  return null;
}
