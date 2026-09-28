import type { BackendPlan } from '../data/plans';

const CACHE_KEY = 'aster:plans-cache:v1';

type PlansCache = {
  plans: BackendPlan[];
  cachedAt: number;
};

export function readCachedPlans(): BackendPlan[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlansCache;
    return Array.isArray(parsed.plans) && parsed.plans.length > 0 ? parsed.plans : null;
  } catch {
    return null;
  }
}

export function writeCachedPlans(plans: BackendPlan[]): void {
  try {
    const cache: PlansCache = { plans, cachedAt: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage unavailable (private mode, quota) — background refresh still works, just isn't cached.
  }
}
