/**
 * Locale scaffolding for future i18n support.
 *
 * Not wired into routing yet — all copy currently lives in `src/config/*`
 * as English strings. When translations are implemented, page/section
 * components should read from `src/locales/<locale>/common.json` (keyed
 * to match `src/config`) instead, and routes should move under `[locale]`.
 */
export const locales = ["en", "pt", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
};
