import type { Currency } from './types';

export const CURRENCIES: { code: Currency; label: string; symbol: string }[] = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'BRL', label: 'Brazilian Real', symbol: 'R$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', label: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
];

// Each currency is formatted using its own native locale for correct
// decimal/grouping conventions (comma-decimal for BRL/EUR, etc.) — except
// CAD/AUD, which use en-US specifically: their native locales (en-CA/
// en-AU) render a bare "$" indistinguishable from USD, while en-US's
// ICU data disambiguates them as "CA$"/"A$" with the same number format
// CAD/AUD actually use (period decimal, comma grouping).
const CURRENCY_LOCALE: Record<Currency, string> = {
  USD: 'en-US',
  BRL: 'pt-BR',
  EUR: 'de-DE',
  GBP: 'en-GB',
  INR: 'en-IN',
  CAD: 'en-US',
  AUD: 'en-US',
};

export function formatMoney(cents: number | null, currency: Currency): string {
  if (cents === null) return 'Add price';
  return new Intl.NumberFormat(CURRENCY_LOCALE[currency], { style: 'currency', currency }).format(cents / 100);
}

export function currencySymbol(currency: Currency): string {
  return CURRENCIES.find((c) => c.code === currency)?.symbol ?? currency;
}
