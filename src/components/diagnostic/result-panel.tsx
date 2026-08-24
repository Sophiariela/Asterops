import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { QUESTIONS, TIER_COPY, WHY_TEXT } from "@/config/diagnostic";
import { fitPercent, getResult } from "@/lib/diagnostic";
import type { RankedSystem } from "@/types";

function SystemCard({ system, rank, max, primary }: { system: RankedSystem; rank: number; max: number; primary: boolean }) {
  const pct = fitPercent(system.value, max);

  return (
    <div
      className={`flex flex-col gap-4 rounded-[10px] border bg-card p-8 ${
        primary ? "border-accent/45 shadow-elevated" : "border-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-accent">
          {system.name}
        </span>
        <span
          className={`rounded-full border px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] ${
            primary ? "border-accent/45 text-accent" : "border-border text-muted-foreground"
          }`}
        >
          {rank === 0 ? "Start here" : "Then this"}
        </span>
      </div>
      <h3 className="text-lg font-medium text-foreground">{system.tagline}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{WHY_TEXT[system.key]}</p>
      <div className="flex flex-col gap-1.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className={`h-full rounded-full ${primary ? "bg-accent" : "bg-accent/45"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          Fit {pct}%
        </span>
      </div>
    </div>
  );
}

export function ResultPanel({ answers, onRestart }: { answers: number[]; onRestart: () => void }) {
  const result = getResult(answers);
  const { chosen, deferred, primary, second, tier, max } = result;
  const tierCopy = TIER_COPY[tier];
  const ctaLabel = tier === "Self-serve" ? `Configure ${primary.name}` : tierCopy.cta;

  const transcript = QUESTIONS.map((q, i) => ({
    theme: q.theme,
    answer: q.options[answers[i]]?.label ?? "—",
  }));

  return (
    <div className="mx-auto max-w-container px-6 pb-32 pt-[72px]">
      <Reveal className="flex flex-col gap-4">
        <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Recommendation
        </span>
        <h1 className="text-balance text-[clamp(32px,4.4vw,52px)] font-medium leading-[1.05] tracking-[-0.03em] text-foreground">
          {chosen.map((c) => c.name).join(" + ")}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          {second
            ? `Two systems fit what you described. Start with ${primary.name} — it addresses your main constraint — then layer ${second.name} once it is live.`
            : "One system addresses what you described. Building more than that right now would add cost without adding outcome."}
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
        <RevealGroup className="flex flex-col gap-5">
          {chosen.map((system, i) => (
            <RevealItem key={system.key}>
              <SystemCard system={system} rank={i} max={max} primary={i === 0} />
            </RevealItem>
          ))}
        </RevealGroup>

        <RevealGroup className="flex flex-col gap-5">
          <RevealItem className="flex flex-col gap-4 rounded-[10px] border border-accent/45 bg-card p-8 shadow-elevated">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {tier}
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">{tierCopy.why}</p>
            <Button asChild className="w-full">
              <Link href="/contact">
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </RevealItem>

          {deferred.length > 0 ? (
            <RevealItem className="flex flex-col gap-4 rounded-[10px] border border-border p-8">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Not recommended yet
              </span>
              <ul className="flex flex-col gap-2.5">
                {deferred.map((system) => (
                  <li key={system.key} className="flex items-center justify-between text-sm text-foreground">
                    <span>{system.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {fitPercent(system.value, max)}%
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Layer these on once the first system is live. Aster never sells all five at once.
              </p>
            </RevealItem>
          ) : null}
        </RevealGroup>
      </div>

      <div className="mt-20 border-t border-border/60 pt-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            What you told us
          </h2>
          <Button type="button" variant="ghost" onClick={onRestart}>
            Start over
          </Button>
        </div>

        <RevealGroup className="mt-8 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
          {transcript.map((item) => (
            <RevealItem key={item.theme} className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-sm text-muted-foreground">{item.theme}</span>
              <span className="text-sm text-foreground">{item.answer}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
