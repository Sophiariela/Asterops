import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RevealItem } from "@/components/shared/reveal";
import { designInspirationsContent, inspirationContactHref } from "@/config/inspirations";
import type { DesignInspiration } from "@/types";

export function InspirationCard({ inspiration }: { inspiration: DesignInspiration }) {
  const isLive = inspiration.status === "live";
  const Icon = inspiration.icon;

  return (
    <RevealItem className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-accent/40">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-accent/15 via-accent/5 to-transparent">
        {inspiration.image ? (
          <Image
            src={inspiration.image}
            alt={`${inspiration.name} — visual reference`}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/20 bg-background/60 text-accent">
              <Icon className="h-6 w-6" />
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex justify-between p-4">
          <Badge variant={isLive ? "default" : "outline"} className="bg-background/85 backdrop-blur">
            {isLive ? designInspirationsContent.liveLabel : designInspirationsContent.conceptLabel}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-7">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
            {inspiration.category}
          </span>
          <h3 className="text-lg font-medium text-foreground">{inspiration.name}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{inspiration.description}</p>
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
          {isLive && inspiration.demoUrl ? (
            <Button asChild variant="outline" size="sm" className="flex-1">
              <a href={inspiration.demoUrl} target="_blank" rel="noopener noreferrer">
                View Experience
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          ) : null}
          <Button asChild size="sm" className="flex-1">
            <Link href={inspirationContactHref(inspiration.slug)}>
              Build Something Similar
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </RevealItem>
  );
}
