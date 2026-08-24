import { QUESTIONS, SYSTEM_TO_SLUG } from "@/config/diagnostic";
import { getProductBySlug } from "@/config/products";
import type { DiagnosticFlags, DiagnosticResult, DiagnosticState, RankedSystem, SystemKey } from "@/types";

const SYSTEM_KEYS: SystemKey[] = ["web", "commerce", "launch", "growth", "ops"];

export const STORAGE_KEY = "aster-diagnostic-v1";

export function initialState(): DiagnosticState {
  return { step: 0, answers: [] };
}

/** Truncates all later answers, not just overwrites the current one — otherwise stale answers keep scoring. */
export function pick(state: DiagnosticState, qIndex: number, optIndex: number): DiagnosticState {
  const answers = state.answers.slice(0, qIndex);
  answers[qIndex] = optIndex;
  return { answers, step: qIndex + 1 };
}

export function back(state: DiagnosticState): DiagnosticState {
  return { ...state, step: Math.max(0, state.step - 1) };
}

export function score(answers: number[]): { totals: Record<SystemKey, number>; flags: DiagnosticFlags } {
  const totals: Record<SystemKey, number> = { web: 0, commerce: 0, launch: 0, growth: 0, ops: 0 };
  const flags: DiagnosticFlags = { integrations: 0, migration: 0, custom: 0 };

  answers.forEach((optIndex, qIndex) => {
    const option = QUESTIONS[qIndex]?.options[optIndex];
    if (!option) return;
    for (const [key, value] of Object.entries(option.scores)) {
      totals[key as SystemKey] += value ?? 0;
    }
    if (option.integrations) flags.integrations += option.integrations;
    if (option.migration) flags.migration += option.migration;
    if (option.custom) flags.custom += option.custom;
  });

  return { totals, flags };
}

function systemInfo(key: SystemKey): { name: string; tagline: string } {
  const product = getProductBySlug(SYSTEM_TO_SLUG[key]);
  return { name: product?.name ?? key, tagline: product?.shortDescription ?? "" };
}

export function getResult(answers: number[]): DiagnosticResult {
  const { totals, flags } = score(answers);

  const ranked: RankedSystem[] = SYSTEM_KEYS.map((key) => ({
    key,
    ...systemInfo(key),
    value: totals[key],
  })).sort((a, b) => b.value - a.value);

  const max = ranked[0]?.value || 1;
  const primary = ranked[0];
  const second = ranked[1] && ranked[1].value >= Math.max(3, primary.value * 0.6) ? ranked[1] : null;
  const chosen = second ? [primary, second] : [primary];

  let tier: DiagnosticResult["tier"] = "Self-serve";
  if (flags.custom > 0) tier = "Aster Studio";
  else if (flags.migration > 0 || flags.integrations >= 2) tier = "Aster Pro";

  return {
    ranked,
    primary,
    second,
    chosen,
    deferred: ranked.filter((r) => !chosen.includes(r)),
    max,
    tier,
  };
}

export function fitPercent(value: number, max: number): number {
  return Math.round((value / max) * 100);
}
