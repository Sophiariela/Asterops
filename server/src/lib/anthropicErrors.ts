import Anthropic from '@anthropic-ai/sdk';
import { CommerceError } from './commerceError.js';

// Shared between Luna AI Insights (CommerceOS) and Luna Website Strategist
// (WebOS) — both call the Messages API and need the same real-cause
// translation instead of a generic 500.
export function translateAnthropicError(err: unknown): never {
  if (err instanceof Anthropic.AuthenticationError) {
    throw new CommerceError(503, 'Luna AI is configured with an invalid API key.');
  }
  if (err instanceof Anthropic.BadRequestError && /credit balance/i.test(err.message)) {
    throw new CommerceError(402, 'Luna AI is configured correctly, but the Anthropic account is out of API credit. Add credit at console.anthropic.com → Plans & Billing.');
  }
  if (err instanceof Anthropic.RateLimitError) {
    throw new CommerceError(429, 'Luna AI is rate-limited right now — try again shortly.');
  }
  if (err instanceof Anthropic.APIError) {
    throw new CommerceError(502, 'Luna AI could not complete this request.');
  }
  throw err;
}
