import type { Metadata } from "next";

import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Design System",
  description: "Aster's design tokens — color, type, spacing and elevation — as shipped in the codebase.",
  path: "/design-system",
});

const neutralRamp = [
  ["100", "#F5F6F8"],
  ["200", "#E3E4E9"],
  ["300", "#C6C8D0"],
  ["400", "#9A9CA6"],
  ["500", "#74767F"],
  ["600", "#565860"],
  ["700", "#3C3D44"],
  ["800", "#26272C"],
  ["900", "#17181B"],
] as const;

const accentRamp = [
  ["100", "#EFEEFE"],
  ["200", "#DEDCFC"],
  ["300", "#C2BEF9"],
  ["400", "#948DF1"],
  ["500", "#4F46E5"],
  ["600", "#4038C4"],
  ["700", "#322C9B"],
  ["800", "#232063"],
  ["900", "#16143A"],
] as const;

const typeScale = [
  { role: "Hero H1", size: "clamp(44px, 7vw, 84px)", weight: "500", tracking: "-0.035em" },
  { role: "Section H2", size: "clamp(32px, 4vw, 48px)", weight: "500", tracking: "-0.03em" },
  { role: "Card H3", size: "20px", weight: "500", tracking: "-0.015em" },
  { role: "Hero sub", size: "clamp(18px, 2.1vw, 21px)", weight: "400", tracking: "—" },
  { role: "Section intro", size: "17px", weight: "400", tracking: "—" },
  { role: "Card body", size: "14.5px", weight: "400", tracking: "—" },
  { role: "Eyebrow (mono)", size: "12px", weight: "500", tracking: "0.2em, uppercase" },
  { role: "Stat numeral (mono)", size: "clamp(30px, 3.4vw, 42px)", weight: "500", tracking: "-0.04em" },
];

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-16 w-full rounded-md border border-border" style={{ background: hex }} />
      <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
        <span>{name}</span>
        <span>{hex}</span>
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="px-6 pb-32 pt-28 sm:pt-36">
      <div className="mx-auto flex max-w-container flex-col gap-24">
        <Reveal className="flex flex-col gap-4">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-accent">
            Design System
          </span>
          <h1 className="max-w-2xl text-balance text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            The tokens behind every Aster surface.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Color, type, spacing and elevation as shipped in the codebase — Geist for headings and
            body, Geist Mono for eyebrows and numerals, one accent used sparingly.
          </p>
        </Reveal>

        <div>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground">Core</h2>
          <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <RevealItem>
              <Swatch name="Ground" hex="#0A0A0C" />
            </RevealItem>
            <RevealItem>
              <Swatch name="Surface" hex="#111214" />
            </RevealItem>
            <RevealItem>
              <Swatch name="Text" hex="#F5F6F8" />
            </RevealItem>
            <RevealItem>
              <Swatch name="Divider" hex="#26272D" />
            </RevealItem>
            <RevealItem>
              <Swatch name="Accent" hex="#4F46E5" />
            </RevealItem>
          </RevealGroup>
        </div>

        <div>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Neutral ramp
          </h2>
          <RevealGroup className="grid grid-cols-3 gap-4 sm:grid-cols-9">
            {neutralRamp.map(([name, hex]) => (
              <RevealItem key={name}>
                <Swatch name={`neutral-${name}`} hex={hex} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Accent ramp
          </h2>
          <RevealGroup className="grid grid-cols-3 gap-4 sm:grid-cols-9">
            {accentRamp.map(([name, hex]) => (
              <RevealItem key={name}>
                <Swatch name={`accent-${name}`} hex={hex} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Type scale
          </h2>
          <RevealGroup className="flex flex-col gap-4">
            {typeScale.map((row) => (
              <RevealItem
                key={row.role}
                className="grid grid-cols-2 gap-4 border-b border-border/60 pb-4 text-sm sm:grid-cols-4"
              >
                <span className="text-foreground">{row.role}</span>
                <span className="font-mono text-muted-foreground">{row.size}</span>
                <span className="font-mono text-muted-foreground">weight {row.weight}</span>
                <span className="font-mono text-muted-foreground">{row.tracking}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Spacing &amp; radius
          </h2>
          <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <RevealItem className="rounded-[10px] border border-border p-6 text-sm text-muted-foreground">
              Section padding: <span className="text-foreground">128px vertical</span>, 24px horizontal.
              Hero: 160px top.
            </RevealItem>
            <RevealItem className="rounded-[10px] border border-border p-6 text-sm text-muted-foreground">
              Content max width: <span className="text-foreground">1280px</span>, centered.
            </RevealItem>
            <RevealItem className="rounded-[10px] border border-border p-6 text-sm text-muted-foreground">
              Radius: 6px small, <span className="text-foreground">10px default</span>, 14px for the CTA
              card.
            </RevealItem>
          </RevealGroup>
        </div>
      </div>
    </div>
  );
}
