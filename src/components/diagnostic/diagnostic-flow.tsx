"use client";

import * as React from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QUESTIONS } from "@/config/diagnostic";
import { STORAGE_KEY, back, initialState, pick } from "@/lib/diagnostic";
import { ResultPanel } from "@/components/diagnostic/result-panel";
import type { DiagnosticState } from "@/types";

export function DiagnosticFlow() {
  const [state, setState] = React.useState<DiagnosticState>(initialState);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) setState(JSON.parse(stored) as DiagnosticState);
    } catch {
      // sessionStorage unavailable or corrupt — start fresh.
    } finally {
      setHydrated(true);
    }
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage unavailable — state just won't survive a refresh.
    }
  }, [state, hydrated]);

  const restart = React.useCallback(() => {
    setState(initialState());
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const isResult = state.step >= QUESTIONS.length;

  if (isResult) {
    return <ResultPanel answers={state.answers} onRestart={restart} />;
  }

  const question = QUESTIONS[state.step];
  const progress = (state.step / QUESTIONS.length) * 100;

  return (
    <div>
      <div className="h-[2px] w-full bg-border">
        <div
          className="h-full bg-accent transition-[width] duration-[220ms] ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto flex max-w-[680px] flex-col gap-8 px-6 pb-24 pt-[72px]">
        <div className="flex flex-col gap-4">
          <span aria-hidden className="h-8 w-[2px] bg-accent" />
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Question {state.step + 1} of {QUESTIONS.length} · {question.theme}
          </span>
          <h1 className="text-balance text-[clamp(28px,3.6vw,40px)] font-medium leading-[1.15] tracking-[-0.03em] text-foreground">
            {question.title}
          </h1>
          <p className="text-[15.5px] leading-relaxed text-muted-foreground">{question.help}</p>
        </div>

        <div className="flex flex-col gap-2.5">
          {question.options.map((option, optIndex) => {
            const selected = state.answers[state.step] === optIndex;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => setState((prev) => pick(prev, state.step, optIndex))}
                className={`flex w-full items-center gap-3 rounded-[10px] border px-[18px] py-5 text-left text-[15px] transition-colors duration-150 ${
                  selected
                    ? "border-accent/45 bg-accent/[0.09] text-foreground"
                    : "border-border bg-card text-foreground hover:border-accent/30"
                }`}
              >
                <span
                  className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? "border-accent" : "border-neutral-700"
                  }`}
                >
                  {selected ? <span className="h-[7px] w-[7px] rounded-full bg-accent" /> : null}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-border/60 pt-6">
          <Button
            type="button"
            variant="outline"
            disabled={state.step === 0}
            onClick={() => setState((prev) => back(prev))}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            Business questions only — no technical decisions
          </span>
        </div>
      </div>
    </div>
  );
}
