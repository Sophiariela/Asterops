// Mirrors server/src/lib/countryPresets.ts's country list — used only to
// pick a sensible date/time display convention (via Intl locale) for the
// country a business selected in Settings. Not a source of truth for
// currency/timezone, which the server already resolved and stored.
const LOCALE_BY_COUNTRY: Record<string, string> = {
  US: 'en-US',
  BR: 'pt-BR',
  DE: 'de-DE',
  FR: 'fr-FR',
  GB: 'en-GB',
  IN: 'en-IN',
  CA: 'en-CA',
  AU: 'en-AU',
};

// "PENDING" / "CONSULTATION" read as raw database values, not product copy.
// Used anywhere a status enum reaches the UI (dropdowns, badges, labels).
export function titleCase(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export function formatDateTime(iso: string, country: string | null, timezone: string | null): string {
  const locale = (country && LOCALE_BY_COUNTRY[country]) || undefined;
  return new Date(iso).toLocaleString(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...(timezone ? { timeZone: timezone } : {}),
  });
}

export function formatTime(iso: string, country: string | null, timezone: string | null): string {
  const locale = (country && LOCALE_BY_COUNTRY[country]) || undefined;
  return new Date(iso).toLocaleTimeString(locale, {
    timeStyle: 'short',
    ...(timezone ? { timeZone: timezone } : {}),
  });
}

// A reservation's calendar "day" must be computed in the business's own
// timezone, not the viewer's browser timezone — otherwise a 11pm booking
// in New York can render on the wrong day for someone viewing from Tokyo.
// Returns a stable YYYY-MM-DD key safe to compare/group by.
export function localDateKey(iso: string, timezone: string | null): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    ...(timezone ? { timeZone: timezone } : {}),
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}
