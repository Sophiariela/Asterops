"use client";

import * as React from "react";
import Image from "next/image";
import { Expand } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Lightbox } from "@/components/shared/lightbox";
import type { ProductExample } from "@/types";

export function ProductGallery({ examples }: { examples?: ProductExample[] }) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  if (!examples || examples.length === 0) return null;

  return (
    <section className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow="Examples"
          title="What the system looks like day to day."
          description="Representative previews — select any example to view it full size."
        />

        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((example, i) => (
            <RevealItem key={example.image}>
              <button
                type="button"
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
                aria-label={`Enlarge example: ${example.title}`}
                className="group flex w-full flex-col gap-3 text-left"
              >
                <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-card transition-colors group-hover:border-accent/40 group-focus-visible:border-accent/40">
                  <Image
                    src={example.image}
                    alt={example.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 380px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition-all duration-200 group-hover:bg-background/50 group-hover:opacity-100 group-focus-visible:bg-background/50 group-focus-visible:opacity-100">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/90 text-foreground">
                      <Expand className="h-4 w-4" />
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-sm font-medium text-foreground">{example.title}</h3>
                  <p className="text-sm text-muted-foreground">{example.description}</p>
                </div>
              </button>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <Lightbox items={examples} index={index} onIndexChange={setIndex} open={open} onOpenChange={setOpen} />
    </section>
  );
}
