import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getServiceIcon } from "@/lib/service-icons";
import type { ServiceSummary } from "@/types";

export function ServiceCard({ service }: { service: ServiceSummary }) {
  const Icon = getServiceIcon(service.icon);

  return (
    <div className="flex h-full flex-col gap-4 p-8">
      <span className="flex h-10 w-10 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent-ink">
        <Icon className="h-[18px] w-[18px]" aria-hidden />
      </span>
      <h3 className="text-base font-medium text-foreground">{service.title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
      {/* O serviço já vai preenchido no formulário — ver ContactForm. */}
      <Link
        href={`/contato?servico=${encodeURIComponent(service.title)}`}
        className="mt-auto inline-flex w-fit items-center gap-1.5 pt-2 text-sm font-medium text-accent-ink transition-opacity hover:opacity-80"
      >
        Quero isso no meu negócio
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </div>
  );
}
