import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'AsterOps <notifications@asterops.app>';

// Mirrors the lazy-init pattern in anthropic.ts / stripeSync.ts: email is
// an optional capability until a real Resend account is connected. With
// no key set, sendEmail logs instead of sending — every caller stays
// exercisable end-to-end (and testable) without the dependency.
const resend = apiKey ? new Resend(apiKey) : null;

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(message: EmailMessage): Promise<{ sent: boolean }> {
  if (!resend) {
    console.log(`[email:not-configured] to=${message.to} subject="${message.subject}"`);
    return { sent: false };
  }
  try {
    await resend.emails.send({ from: FROM_EMAIL, to: message.to, subject: message.subject, html: message.html });
    return { sent: true };
  } catch (err) {
    // A notification failing to send should never fail the request that
    // triggered it (a submitted lead/reservation/review is still real and
    // stored even if the email side-effect fails) — log and move on.
    console.error(`[email:send-failed] to=${message.to} subject="${message.subject}"`, err);
    return { sent: false };
  }
}
