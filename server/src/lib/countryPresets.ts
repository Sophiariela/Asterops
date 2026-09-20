import type { SiteCurrency } from '@prisma/client';

export type CountryPreset = { code: string; name: string; currency: SiteCurrency; timezone: string };

// Real IANA timezones and ISO currency codes — one representative country
// per supported currency, plus a second Eurozone option, since "Country"
// exists only to auto-fill Currency/Timezone, not as a general geography
// picker. Adding an unsupported-currency country would need a new
// currency added to SiteCurrency first.
export const COUNTRY_PRESETS: CountryPreset[] = [
  { code: 'US', name: 'United States', currency: 'USD', timezone: 'America/New_York' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', timezone: 'America/Sao_Paulo' },
  { code: 'DE', name: 'Germany', currency: 'EUR', timezone: 'Europe/Berlin' },
  { code: 'FR', name: 'France', currency: 'EUR', timezone: 'Europe/Paris' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', timezone: 'Europe/London' },
  { code: 'IN', name: 'India', currency: 'INR', timezone: 'Asia/Kolkata' },
  { code: 'CA', name: 'Canada', currency: 'CAD', timezone: 'America/Toronto' },
  { code: 'AU', name: 'Australia', currency: 'AUD', timezone: 'Australia/Sydney' },
];

export function findCountryPreset(code: string): CountryPreset | undefined {
  return COUNTRY_PRESETS.find((c) => c.code === code);
}
