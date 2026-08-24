export type SystemKey = "web" | "commerce" | "launch" | "growth" | "ops";

export interface DiagnosticOption {
  label: string;
  scores: Partial<Record<SystemKey, number>>;
  integrations?: number;
  migration?: number;
  custom?: number;
}

export interface DiagnosticQuestion {
  theme: string;
  title: string;
  help: string;
  options: DiagnosticOption[];
}

export type DiagnosticTier = "Self-serve" | "Aster Pro" | "Aster Studio";

export interface DiagnosticState {
  step: number;
  /** answers[i] = chosen option index for question i */
  answers: number[];
}

export interface RankedSystem {
  key: SystemKey;
  name: string;
  tagline: string;
  value: number;
}

export interface DiagnosticFlags {
  integrations: number;
  migration: number;
  custom: number;
}

export interface DiagnosticResult {
  ranked: RankedSystem[];
  primary: RankedSystem;
  second: RankedSystem | null;
  chosen: RankedSystem[];
  deferred: RankedSystem[];
  max: number;
  tier: DiagnosticTier;
}
