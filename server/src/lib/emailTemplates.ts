// Shared branded shell for every WebOS transactional email — kept as
// inline styles (not a stylesheet) since most email clients strip <style>
// tags. Brand color matches --color-ASTER-600 from the app's own design
// tokens (src/index.css) so notification emails read as the same product.
const BRAND_COLOR = '#5b2ee5';

function shell(businessName: string, title: string, bodyHtml: string): string {
  return `
<div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
  <p style="font-weight: 800; font-size: 14px; letter-spacing: 0.02em; color: ${BRAND_COLOR}; margin: 0 0 24px;">${escapeHtml(businessName)}</p>
  <h1 style="font-size: 20px; font-weight: 800; color: #0f0f14; margin: 0 0 16px;">${escapeHtml(title)}</h1>
  ${bodyHtml}
  <p style="font-size: 12px; color: #94a3b8; margin-top: 32px; padding-top: 16px; border-top: 1px solid #ede9fe;">
    Sent by ${escapeHtml(businessName)} via AsterOps WebOS.
  </p>
</div>`.trim();
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function row(label: string, value: string): string {
  return `<tr><td style="padding: 4px 12px 4px 0; color: #64748b; font-size: 13px; font-weight: 600;">${escapeHtml(label)}</td><td style="padding: 4px 0; color: #0f0f14; font-size: 13px;">${escapeHtml(value)}</td></tr>`;
}

export function leadNotificationEmail(businessName: string, lead: { name: string | null; email: string; phone: string | null; message: string | null; source: string | null }): string {
  const rows = [
    row('Name', lead.name ?? 'Not provided'),
    row('Email', lead.email),
    ...(lead.phone ? [row('Phone', lead.phone)] : []),
    ...(lead.source ? [row('Source page', lead.source)] : []),
  ].join('');
  const message = lead.message
    ? `<p style="font-size: 14px; color: #0f0f14; background: #f8fafc; border-radius: 12px; padding: 12px 16px; margin: 16px 0 0;">${escapeHtml(lead.message)}</p>`
    : '';
  return shell(businessName, 'New lead', `
    <table style="width: 100%; border-collapse: collapse;">${rows}</table>
    ${message}
  `);
}

export function reservationNotificationEmail(businessName: string, r: { customerName: string; customerEmail: string; customerPhone: string | null; partySize: number; whenLabel: string; notes: string | null; showPartySize?: boolean }): string {
  const rows = [
    row('Guest', r.customerName),
    ...(r.showPartySize === false ? [] : [row('Party size', String(r.partySize))]),
    row('Date & time', r.whenLabel),
    row('Email', r.customerEmail),
    ...(r.customerPhone ? [row('Phone', r.customerPhone)] : []),
  ].join('');
  const notes = r.notes
    ? `<p style="font-size: 14px; color: #0f0f14; background: #f8fafc; border-radius: 12px; padding: 12px 16px; margin: 16px 0 0;">${escapeHtml(r.notes)}</p>`
    : '';
  return shell(businessName, r.showPartySize === false ? 'New booking' : 'New reservation', `
    <table style="width: 100%; border-collapse: collapse;">${rows}</table>
    ${notes}
  `);
}

export function reservationConfirmationEmail(businessName: string, r: { partySize: number; whenLabel: string; showPartySize?: boolean }): string {
  return shell(businessName, r.showPartySize === false ? 'Booking confirmed' : 'Reservation confirmed', `
    <p style="font-size: 14px; color: #0f0f14; line-height: 1.6;">Thank you for booking with ${escapeHtml(businessName)}. ${r.showPartySize === false ? 'We look forward to speaking with you.' : 'We look forward to seeing you.'}</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
      ${row('Date & time', r.whenLabel)}
      ${r.showPartySize === false ? '' : row('Guests', String(r.partySize))}
    </table>
  `);
}

export function reviewNotificationEmail(businessName: string, review: { authorName: string; rating: number; comment: string; source: string | null }): string {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  return shell(businessName, 'New review', `
    <table style="width: 100%; border-collapse: collapse;">
      ${row('From', review.authorName)}
      ${row('Rating', stars)}
      ${review.source ? row('Page', review.source) : ''}
    </table>
    <p style="font-size: 14px; color: #0f0f14; background: #f8fafc; border-radius: 12px; padding: 12px 16px; margin: 16px 0 0;">${escapeHtml(review.comment)}</p>
  `);
}
