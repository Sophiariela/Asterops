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

Plain language, no markdown, no preamble, no em dashes (use periods or commas instead). Three short lines, each starting with "- ".`;

const BLUEPRINT_SYSTEM_PROMPT = `You are Luna, ASTER's website strategist, embedded in WebOS.
You are given a structural snapshot of one merchant's site: its page architecture (real sections
per page), its real internal conversion paths and lead-capture coverage, its trust map coverage,
and its deployment readiness checklist.

You have NO information about visual layout, section order on the rendered page, or real visitor
behavior — never claim something is positioned above or below something else, and never cite a
visitor or conversion-rate statistic that isn't in the data given.

Write 3 to 5 short strategic recommendations a business owner can act on, grounded ONLY in the
structure given. Each is one sentence, plain language, no markdown, no preamble, no em dashes
(use periods or commas instead), starting with "- ".`;

const TEMPLATE_RECOMMEND_SYSTEM_PROMPT = `You are Luna, ASTER's website strategist.
You are given a real list of published website templates (name, industry, primary goal, recommended
use case) and a business's real industry, target audience, and description.

Pick exactly one template from the list given that best fits this business. Never invent or reference
a template that isn't in the list.

Respond in exactly two lines, each starting with "- ", with no em dashes (use periods or commas instead):
- The recommended template's exact name from the list, then one sentence on why it fits.
- One sentence suggesting a structural adjustment worth considering for this specific business (e.g. an
  extra page, a different call-to-action, dropping a page that doesn't fit).`;

// Belt-and-suspenders for the "no em dashes" instruction above — the model
// mostly complies, but this guarantees it regardless of what comes back.
function stripEmDashes(text: string): string {
  return text.replace(/\s*—\s*/g, ', ').replace(/—/g, ',');
}

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
    .map((line) => stripEmDashes(line.replace(/^-\s*/, '').trim()))
    .filter(Boolean);

  return lines.length ? lines : [stripEmDashes(text.trim())].filter(Boolean);
}

// Quick Actions below apply Luna's output directly to the site rather than
// just returning advice — the JSON contract keeps the response parseable
// enough to write straight back to the database.
async function callLunaJson<T>(systemPrompt: string, snapshot: unknown): Promise<T> {
  if (!anthropic) {
    throw new CommerceError(503, 'Luna AI is not configured on this server yet.');
  }

  let response;
  try {
    response = await anthropic.messages.create({
      model: 'claude-opus-5',
      max_tokens: 2048,
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

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new CommerceError(502, 'Luna AI returned an unexpected response.');
  try {
    return JSON.parse(match[0]) as T;
  } catch {
    throw new CommerceError(502, 'Luna AI returned an unexpected response.');
  }
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

const IMPROVE_HOMEPAGE_SYSTEM_PROMPT = `You are Luna, ASTER's website strategist.
You are given a business's real context and its home page's current hero headline and subheadline.
Write a better version of both, specific to this business, outcome-focused rather than feature-focused.
No em dashes (use periods or commas instead), no markdown, no quotation marks around the text itself.

Respond with ONLY a JSON object, no other text: {"heroHeadline": "...", "heroSubheadline": "..."}`;

export async function improveHomepage(ownerId: string, siteId: string) {
  const site = await prisma.site.findFirst({ where: { id: siteId, ownerId } });
  if (!site) throw new CommerceError(404, 'Site not found.');
  const homePage = await prisma.page.findFirst({ where: { siteId, slug: 'home' } }) ?? await prisma.page.findFirst({ where: { siteId }, orderBy: { order: 'asc' } });
  if (!homePage) throw new CommerceError(404, 'This site has no pages yet.');

  const result = await callLunaJson<{ heroHeadline: string; heroSubheadline: string }>(IMPROVE_HOMEPAGE_SYSTEM_PROMPT, {
    business: { name: site.businessName, industry: site.industry, targetAudience: site.targetAudience },
    current: { heroHeadline: homePage.heroHeadline, heroSubheadline: homePage.heroSubheadline },
  });
  if (!result.heroHeadline || !result.heroSubheadline) throw new CommerceError(502, 'Luna AI returned an unexpected response.');

  const updated = await prisma.page.update({
    where: { id: homePage.id },
    data: { heroHeadline: stripEmDashes(result.heroHeadline), heroSubheadline: stripEmDashes(result.heroSubheadline) },
  });
  return { page: updated };
}

const MENU_DESCRIPTIONS_SYSTEM_PROMPT = `You are Luna, ASTER's website strategist, writing menu copy for a restaurant.
You are given a list of menu items (id, name, category) that have no description yet.
Write one appetizing, concise description per item (under 110 characters), based only on what the
item's name and category imply — never invent specific ingredients, allergens, or health claims that
aren't obvious from the name. No em dashes (use periods or commas instead), no markdown.

Respond with ONLY a JSON object, no other text: {"items": [{"id": "...", "description": "..."}]}`;

export async function generateMenuDescriptions(ownerId: string, siteId: string) {
  const site = await prisma.site.findFirst({ where: { id: siteId, ownerId }, include: { menuCategories: { include: { items: true } } } });
  if (!site) throw new CommerceError(404, 'Site not found.');

  const targets = site.menuCategories.flatMap((cat) =>
    cat.items.filter((item) => !item.description).map((item) => ({ id: item.id, name: item.name, category: cat.name })),
  );
  if (targets.length === 0) return { items: [] as { id: string; name: string; description: string }[] };

  const result = await callLunaJson<{ items: { id: string; description: string }[] }>(MENU_DESCRIPTIONS_SYSTEM_PROMPT, {
    business: { name: site.businessName, targetAudience: site.targetAudience },
    items: targets,
  });

  const byId = new Map(targets.map((t) => [t.id, t.name]));
  const applied: { id: string; name: string; description: string }[] = [];
  for (const row of result.items ?? []) {
    if (!byId.has(row.id) || !row.description) continue;
    const description = stripEmDashes(row.description).slice(0, 500);
    await prisma.menuItem.update({ where: { id: row.id }, data: { description } });
    applied.push({ id: row.id, name: byId.get(row.id)!, description });
  }
  return { items: applied };
}

const IMPROVE_SEO_SYSTEM_PROMPT = `You are Luna, ASTER's website strategist, writing SEO metadata.
You are given a list of pages (id, name, heroHeadline, heroSubheadline) missing an SEO title and/or description.
Write an SEO title (under 60 characters) and description (under 155 characters) per page, grounded in
the page's real content and the business's real context. No em dashes (use periods or commas instead),
no markdown, no quotation marks.

Respond with ONLY a JSON object, no other text: {"pages": [{"id": "...", "seoTitle": "...", "seoDescription": "..."}]}`;

export async function improveSeo(ownerId: string, siteId: string) {
  const site = await prisma.site.findFirst({ where: { id: siteId, ownerId }, include: { pages: true } });
  if (!site) throw new CommerceError(404, 'Site not found.');

  const targets = site.pages.filter((p) => !p.seoTitle || !p.seoDescription);
  if (targets.length === 0) return { pages: [] as { id: string; seoTitle: string; seoDescription: string }[] };

  const result = await callLunaJson<{ pages: { id: string; seoTitle: string; seoDescription: string }[] }>(IMPROVE_SEO_SYSTEM_PROMPT, {
    business: { name: site.businessName, industry: site.industry, targetAudience: site.targetAudience },
    pages: targets.map((p) => ({ id: p.id, name: p.name, heroHeadline: p.heroHeadline, heroSubheadline: p.heroSubheadline })),
  });

  const validIds = new Set(targets.map((p) => p.id));
  const applied: { id: string; seoTitle: string; seoDescription: string }[] = [];
  for (const row of result.pages ?? []) {
    if (!validIds.has(row.id) || !row.seoTitle || !row.seoDescription) continue;
    const seoTitle = stripEmDashes(row.seoTitle).slice(0, 160);
    const seoDescription = stripEmDashes(row.seoDescription).slice(0, 320);
    await prisma.page.update({ where: { id: row.id }, data: { seoTitle, seoDescription } });
    applied.push({ id: row.id, seoTitle, seoDescription });
  }
  return { pages: applied };
}

const RESERVATIONS_ADVICE_SYSTEM_PROMPT = `You are Luna, ASTER's website strategist, advising a restaurant
owner on how to get more reservations. You are given real data: reservation counts by status, trust
coverage, and lead-capture coverage. Ground every recommendation in the data given, never invent a
visitor or conversion statistic that isn't there.

Write 3 to 5 short, concrete tactics, each one sentence, plain language, no markdown, no preamble,
no em dashes (use periods or commas instead), starting with "- ".`;

export async function reservationsAdvice(ownerId: string, siteId: string): Promise<{ review: string[] }> {
  const site = await prisma.site.findFirst({ where: { id: siteId, ownerId } });
  if (!site) throw new CommerceError(404, 'Site not found.');

  const [reservations, trustMap, leadCaptureMap] = await Promise.all([
    prisma.reservation.groupBy({ by: ['status'], where: { siteId }, _count: { status: true } }),
    getTrustMap(ownerId, siteId),
    getLeadCaptureMap(ownerId, siteId),
  ]);

  const snapshot = {
    business: { name: site.businessName, targetAudience: site.targetAudience },
    reservationsByStatus: Object.fromEntries(reservations.map((r) => [r.status, r._count.status])),
    trustCoverage: trustMap.coverage,
    leadCaptureCoverage: leadCaptureMap.coverage,
  };

  const review = await callLuna(RESERVATIONS_ADVICE_SYSTEM_PROMPT, snapshot);
  return { review };
}
