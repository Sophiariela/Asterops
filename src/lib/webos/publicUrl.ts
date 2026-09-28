import type { Site } from './types';

// The known-good production origin public site links should use — never
// window.location.origin, which reflects wherever the *dashboard* happens
// to be loaded from (a preview deploy, a misconfigured custom domain that
// doesn't resolve, localhost) and is unsafe to hand a customer as their
// live site's address. Overridable via VITE_PUBLIC_SITE_URL once a real
// apex custom domain is fully connected (DNS verified, not just added in
// the Vercel dashboard).
const FALLBACK_PRODUCTION_ORIGIN = 'https://asterops-lime.vercel.app';
export const PRODUCTION_ORIGIN = (import.meta.env.VITE_PUBLIC_SITE_URL ?? FALLBACK_PRODUCTION_ORIGIN).replace(/\/+$/, '');

export type DomainStatus = 'checking' | 'reachable' | 'unreachable';

function buildProductionSiteUrl(slug: string): string {
  return `${PRODUCTION_ORIGIN}/site/${slug}`;
}

// Synchronous best-guess URL for immediate render (no network round trip):
// a per-site custom domain if one is set, otherwise the known-good
// production origin. Never window.location.origin. Callers that can show
// a brief "verifying…" state should follow up with resolvePublicSiteUrl()
// to confirm — or fall back off — an unreachable custom domain.
export function getPublicSiteUrl(site: Pick<Site, 'slug' | 'customDomain'>): string | null {
  if (site.customDomain) return `https://${site.customDomain}`;
  if (site.slug) return buildProductionSiteUrl(site.slug);
  return null;
}

const REACHABILITY_TIMEOUT_MS = 4000;

// A real reachability check — DNS resolution + TLS handshake + a response,
// which is exactly what fails with DNS_PROBE_FINISHED_NXDOMAIN. no-cors so
// a cross-origin target without CORS headers still resolves instead of
// throwing on the opaque response (we only care whether the request
// completed, not the body). AbortController bounds it so a black-holed
// domain can't stall the UI indefinitely.
async function isOriginReachable(origin: string): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REACHABILITY_TIMEOUT_MS);
  try {
    await fetch(origin, { method: 'HEAD', mode: 'no-cors', cache: 'no-store', signal: controller.signal });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export type ResolvedPublicUrl = {
  url: string | null;
  domainStatus: DomainStatus;
  /** True when a custom domain was requested but unreachable, so this URL is the production fallback instead. */
  usedFallback: boolean;
};

// Verifies the domain behind getPublicSiteUrl() is actually reachable
// before it's shown to the customer as "your live site". A custom domain
// that fails DNS/connectivity falls back to the production slug URL
// rather than handing out a dead link.
export async function resolvePublicSiteUrl(site: Pick<Site, 'slug' | 'customDomain'>): Promise<ResolvedPublicUrl> {
  if (site.customDomain) {
    const customUrl = `https://${site.customDomain}`;
    const reachable = await isOriginReachable(customUrl);
    if (reachable) return { url: customUrl, domainStatus: 'reachable', usedFallback: false };
    return site.slug
      ? { url: buildProductionSiteUrl(site.slug), domainStatus: 'unreachable', usedFallback: true }
      : { url: null, domainStatus: 'unreachable', usedFallback: false };
  }

  if (!site.slug) return { url: null, domainStatus: 'unreachable', usedFallback: false };

  const productionUrl = buildProductionSiteUrl(site.slug);
  const reachable = await isOriginReachable(PRODUCTION_ORIGIN);
  return { url: productionUrl, domainStatus: reachable ? 'reachable' : 'unreachable', usedFallback: false };
}
