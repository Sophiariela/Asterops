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

export function formatDateTime(iso: string, country: string | null, timezone: string | null): string {
  const locale = (country && LOCALE_BY_COUNTRY[country]) || undefined;
  return new Date(iso).toLocaleString(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...(timezone ? { timeZone: timezone } : {}),
  });
}
