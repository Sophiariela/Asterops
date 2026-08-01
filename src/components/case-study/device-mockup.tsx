import Image from "next/image";

import { cn } from "@/lib/utils";
import type { CaseStudyMockup } from "@/types";

interface DeviceMockupProps extends CaseStudyMockup {
  className?: string;
  priority?: boolean;
}

export function DeviceMockup({ device, image, label, className, priority }: DeviceMockupProps) {
  if (device === "desktop" || device === "laptop") {
    return (
      <div className={cn("w-full overflow-hidden rounded-lg border border-border bg-card", className)}>
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </div>
        <div className="relative aspect-[16/10] w-full bg-background">
          <Image
            src={image}
            alt={`${label} preview`}
            fill
            unoptimized
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 960px"
            className="object-cover"
          />
        </div>
        {device === "laptop" ? (
          <div className="flex justify-center border-t border-border py-2.5">
            <span className="h-1 w-14 rounded-full bg-border" />
          </div>
        ) : null}
      </div>
    );
  }

  if (device === "tablet") {
    return (
      <div className={cn("w-full rounded-[1.75rem] border border-border bg-card p-3", className)}>
        <div className="flex justify-center pb-2">
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
        </div>
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border bg-background">
          <Image
            src={image}
            alt={`${label} preview`}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full rounded-[2rem] border border-border bg-card p-2.5", className)}>
      <div className="flex justify-center pb-2 pt-0.5">
        <span className="h-1.5 w-12 rounded-full bg-muted-foreground/40" />
      </div>
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[1.4rem] border border-border bg-background">
        <Image
          src={image}
          alt={`${label} preview`}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, 240px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
