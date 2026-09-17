import { anthropic } from '../../../lib/anthropic.js';
import { CommerceError } from '../../../lib/commerceError.js';
import { translateAnthropicError } from '../../../lib/anthropicErrors.js';
import { prisma } from '../../../lib/prisma.js';

const SYSTEM_PROMPT = `You are Luna, ASTER's website strategist, embedded in WebOS.
You are given the real content of one page from a merchant's site — its headline, subheadline,
call-to-action, and content sections — plus the site's business context.

Critique the page like a conversion copywriter would, grounded ONLY in the content given:
1. One sentence naming the single biggest weakness (e.g. "This hero section focuses on features
   rather than outcomes.")
2. A recommended replacement headline that fixes it, specific to this business — not generic.
3. One sentence on SEO or trust if there's an obvious gap (e.g. missing meta description).

Plain language, no markdown, no preamble. Three short lines, each starting with "- ".`;

export async function reviewPage(ownerId: string, siteId: string, pageId: string): Promise<{ review: string[] }> {
  if (!anthropic) {
    throw new CommerceError(503, 'Luna AI is not configured on this server yet.');
  }

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

  let response;
  try {
    response = await anthropic.messages.create({
      model: 'claude-opus-5',
      max_tokens: 1024,
      output_config: { effort: 'medium' },
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: JSON.stringify(snapshot) }],
    });
  } catch (err) {
    translateAnthropicError(err);
  }

  const text = response.content
    .filter((block): block is Extract<typeof block, { type: 'text' }> => block.type === 'text')
    .map((block) => block.text)
    .join('\n');

  const review = text
    .split('\n')
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter(Boolean);

  return { review: review.length ? review : [text.trim()].filter(Boolean) };
}
