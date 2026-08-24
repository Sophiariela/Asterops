import type { Metadata } from "next";

import { Reveal } from "@/components/shared/reveal";
import { PortalConcept } from "@/components/portal/portal-concept";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Client Portal",
  description: "A concept preview of the Aster Client Portal — active projects, deliverables, messages, documents, billing and support in one workspace.",
  path: "/portal",
});

export default function PortalPage() {
  return (
    <section className="px-6 pb-8 pt-28 sm:pt-36">
      <Reveal className="mx-auto flex max-w-container flex-col gap-3">
        <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-accent">
          Client Portal
        </span>
        <h1 className="max-w-2xl text-balance text-3xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-4xl">
          One workspace for every active Aster engagement.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
          This is a concept — not yet a committed feature. It shows what a client workspace looks like
          once a system is live: project status, deliverables, messages, documents, billing and support,
          seeded here with example data from a real Aster build.
        </p>
      </Reveal>
      <PortalConcept />
    </section>
  );
}
