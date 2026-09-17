import { loadSiteForAnalysis } from './shared.js';

export type ArchitectureNode = { type: string; label: string };
export type ArchitecturePage = { pageId: string; slug: string; name: string; nodes: ArchitectureNode[] };

// Hero and CTA aren't stored in the `sections` array — they're columns on
// Page itself — so the tree stitches them in as the first and last node of
// every page, with whatever real sections exist in between. This is the
// site's actual structure, not a generic template shape.
export async function getWebsiteArchitecture(ownerId: string, siteId: string): Promise<ArchitecturePage[]> {
  const site = await loadSiteForAnalysis(ownerId, siteId);

  return site.pages.map((p) => {
    const nodes: ArchitectureNode[] = [{ type: 'hero', label: p.heroHeadline }];
    const sections = Array.isArray(p.sections) ? (p.sections as { type: string; heading: string }[]) : [];
    for (const s of sections) {
      nodes.push({ type: s.type, label: s.heading });
    }
    if (p.hasLeadForm) nodes.push({ type: 'lead-form', label: 'Lead capture form' });
    nodes.push({ type: 'cta', label: p.ctaLabel });
    return { pageId: p.id, slug: p.slug, name: p.name, nodes };
  });
}
