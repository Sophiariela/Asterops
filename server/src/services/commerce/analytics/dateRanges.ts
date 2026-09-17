export const DAY_MS = 24 * 60 * 60 * 1000;

export function daysAgo(n: number): Date {
  return new Date(Date.now() - n * DAY_MS);
}

export function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null; // null = "no baseline to compare to"
  return Math.round(((current - previous) / previous) * 1000) / 10; // one decimal
}

// Statuses that represent real, counted revenue — a cancelled or refunded
// order should never inflate a trend or a top-products ranking.
export const REVENUE_STATUSES = ['PENDING', 'PROCESSING', 'FULFILLED'] as const;
