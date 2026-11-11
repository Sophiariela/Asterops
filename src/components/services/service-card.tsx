import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getServiceIcon } from "@/lib/service-icons";
import type { ServiceSummary } from "@/types";

export function ServiceCard({ service }: { service: ServiceSummary }) {
  const Icon = getServiceIcon(service.icon);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-8">
      <span className="flex h-11 w-11 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="text-base font-medium text-foreground">{service.title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
      <Link
        href={`/contact?service=${encodeURIComponent(service.title)}`}
        className="mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent/80"
      >
        Start a project
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
