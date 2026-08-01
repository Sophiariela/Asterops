import type { ReactNode } from "react";

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-border/60 py-10 first:border-t-0 first:pt-0">
      <h2 className="text-xl font-medium tracking-tight text-foreground">{title}</h2>
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground [&_li]:list-disc [&_li]:ml-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
        {children}
      </div>
    </section>
  );
}
