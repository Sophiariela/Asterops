import type { Site } from './types';

export const PUBLIC_SITE_ROOT_DOMAIN = 'asterops.co';

export function getPublicSiteUrl(site: Pick<Site, 'slug' | 'customDomain'>): string | null {
  if (site.customDomain) return `https://${site.customDomain}`;
  if (site.slug) return `https://${PUBLIC_SITE_ROOT_DOMAIN}/site/${site.slug}`;
  return null;
}
