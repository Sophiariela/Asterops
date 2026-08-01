import Link from "next/link";
import { Asterisk } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2 font-mono text-base font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
        <Asterisk className="h-4 w-4" strokeWidth={2.5} />
      </span>
      {siteConfig.name}
    </Link>
  );
}
