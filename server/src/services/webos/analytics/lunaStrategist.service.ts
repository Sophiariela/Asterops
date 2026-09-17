import { anthropic } from '../../../lib/anthropic.js';
import { CommerceError } from '../../../lib/commerceError.js';
import { translateAnthropicError } from '../../../lib/anthropicErrors.js';
import { prisma } from '../../../lib/prisma.js';
import { getWebsiteArchitecture } from './architecture.service.js';
import { getConversionPaths } from './conversionPaths.service.js';
import { getTrustMap } from './trustMap.service.js';
import { getLeadCaptureMap } from './leadCaptureMap.service.js';
import { getDeploymentReadiness } from './deploymentReadiness.service.js';
import { listPublishedTemplates } from '../templates.service.js';

const PAGE_SYSTEM_PROMPT = `You are Luna, ASTER's website strategist, embedded in WebOS.
You are given the real content of one page from a merchant's site — its headline, subheadline,
call-to-action, and content sections — plus the site's business context.

Critique the page like a conversion copywriter would, grounded ONLY in the content given:
1. One sentence naming the single biggest weakness (e.g. "This hero section focuses on features
   rather than outcomes.")
2. A recommended replacement headline that fixes it, specific to this business — not generic.
3. One sentence on SEO or trust if there's an obvious gap (e.g. missing meta description).

Plain language, no markdown, no preamble. Three short lines, each starting with "- ".`;

const BLUEPRINT_SYSTEM_PROMPT = `You are Luna, ASTER's website strategist, embedded in WebOS.
You are given a structural snapshot of one merchant's site: its page architecture (real sections
per page), its real internal conversion paths and lead-capture coverage, its trust map coverage,
and its deployment readiness checklist.

You have NO information about visual layout, section order on the rendered page, or real visitor
behavior — never claim something is positioned above or below something else, and never cite a
visitor or conversion-rate statistic that isn't in the data given.

Write 3 to 5 short strategic recommendations a business owner can act on, grounded ONLY in the
structure given. Each is one sentence, plain language, no markdown, no preamble, starting with "- ".`;

const TEMPLATE_RECOMMEND_SYSTEM_PROMPT = `You are Luna, ASTER's website strategist.
You are given a real list of published website templates (name, industry, primary goal, recommended
use case) and a business's real industry, target audience, and description.

Pick exactly one template from the list given that best fits this business. Never invent or reference
a template that isn't in the list.

Respond in exactly two lines, each starting with "- ":
- The recommended template's exact name from the list, then one sentence on why it fits.
- One sentence suggesting a structural adjustment worth considering for this specific business (e.g. an
  extra page, a different call-to-action, dropping a page that doesn't fit).`;

async function callLuna(systemPrompt: string, snapshot: unknown): Promise<string[]> {
  if (!anthropic) {
    throw new CommerceError(503, 'Luna AI is not configured on this server yet.');
  }

  let response;
  try {
    response = await anthropic.messages.create({
      model: 'claude-opus-5',
      max_tokens: 1024,
      output_config: { effort: 'medium' },
      system: systemPrompt,
      messages: [{ role: 'user', content: JSON.stringify(snapshot) }],
    });
  } catch (err) {
    translateAnthropicError(err);
  }

  const text = response.content
    .filter((block): block is Extract<typeof block, { type: 'text' }> => block.type === 'text')
    .map((block) => block.text)
    .join('\n');

  const lines = text
    .split('\n')
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter(Boolean);

  return lines.length ? lines : [text.trim()].filter(Boolean);
}

export async function reviewPage(ownerId: string, siteId: string, pageId: string): Promise<{ review: string[] }> {
  const site = await prisma.site.findFirst({ where: { id: siteId, ownerId } });
  if (!site) throw new CommerceError(404, 'Site not found.');
  const page = await prisma.page.findFirst({ where: { id: pageId, siteId } });
  if (!page) throw new CommerceError(404, 'Page not found.');

  const snapshot = {
    business: { name: site.businessName, industry: site.industry, targetAudience: site.targetAudience },
    page: {
      name: page.name,
      heroHeadline: page.heroHeadline,
      heroSubheadline: page.heroSubheadline,
      ctaLabel: page.ctaLabel,
      hasSeoTitle: Boolean(page.seoTitle),
      hasSeoDescription: Boolean(page.seoDescription),
      hasLeadForm: page.hasLeadForm,
      sections: page.sections,
    },
  };

  const review = await callLuna(PAGE_SYSTEM_PROMPT, snapshot);
  return { review };
}

export async function reviewBlueprint(ownerId: string, siteId: string): Promise<{ review: string[] }> {
  const site = await prisma.site.findFirst({ where: { id: siteId, ownerId } });
  if (!site) throw new CommerceError(404, 'Site not found.');

  const [architecture, conversionPaths, trustMap, leadCaptureMap, readiness] = await Promise.all([
    getWebsiteArchitecture(ownerId, siteId),
    getConversionPaths(ownerId, siteId),
    getTrustMap(ownerId, siteId),
    getLeadCaptureMap(ownerId, siteId),
    getDeploymentReadiness(ownerId, siteId),
  ]);

  const snapshot = {
    business: { name: site.businessName, industry: site.industry, targetAudience: site.targetAudience },
    architecture: architecture.map((p) => ({ page: p.name, nodes: p.nodes.map((n) => n.type) })),
    conversionPaths: conversionPaths.paths,
    directCapturePoints: conversionPaths.directCapturePoints,
    leadCaptureCoverage: leadCaptureMap.coverage,
    trustCoverage: trustMap.coverage,
    trustCategories: trustMap.categories.map((c) => ({ label: c.label, count: c.count, target: c.target })),
    deploymentReadiness: readiness.readiness,
    missingForLaunch: readiness.missing,
  };

  const review = await callLuna(BLUEPRINT_SYSTEM_PROMPT, snapshot);
  return { review };
}

export async function recommendTemplate(input: {
  industry: string;
  targetAudience: string;
  description: string;
}): Promise<{ review: string[]; recommendedTemplateId: string | null }> {
  const templates = await listPublishedTemplates({});
  const snapshot = {
    business: input,
    templates: templates.map((t) => ({
      name: t.name,
      industry: t.industry,
      primaryGoal: t.primaryGoal,
      recommendedUseCase: t.recommendedUseCase,
    })),
  };

  const review = await callLuna(TEMPLATE_RECOMMEND_SYSTEM_PROMPT, snapshot);

  // Luna is instructed to name a real template, but the match is verified
  // here rather than trusted — if her first line doesn't contain a name
  // from the real list, no template id is linked rather than guessing one.
  const firstLine = (review[0] ?? '').toLowerCase();
  const matched = templates.find((t) => firstLine.includes(t.name.toLowerCase()));

  return { review, recommendedTemplateId: matched?.id ?? null };
}
