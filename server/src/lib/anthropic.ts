import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY;

// Mirrors the lazy-init pattern in stripeSync.ts: Luna AI insights are an
// optional capability, not a hard dependency — the rest of CommerceOS must
// keep working with this unset.
export const anthropic = apiKey ? new Anthropic({ apiKey }) : null;
