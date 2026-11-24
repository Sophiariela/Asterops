import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { WhatsAppLink } from "@/components/shared/whatsapp-link";
import { contactContent } from "@/config/content";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { getSiteSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Solicitar diagnóstico",
  description:
    "Conte como o seu negócio funciona hoje. A Aster responde com o caminho, o escopo e o próximo passo — em até um dia útil.",
  path: "/contato",
});

interface ContactPageProps {
  /** `servico` vem dos cartões de solução; `plano`, dos níveis. */
  searchParams: Promise<{ servico?: string; plano?: string; service?: string }>;
}

export default async function ContatoPage({ searchParams }: ContactPageProps) {
  const { hero, info } = contactContent;
  const params = await searchParams;
  const preselected = params.servico ?? params.service;

  // O formulário é o mecanismo de conversão principal: ele precisa abrir
  // mesmo que a lista de serviços ou de níveis não carregue.
  const [services, tiers, settings] = await Promise.all([
    safeQuery(
      "contact services",
      () => prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
      [],
    ),
    safeQuery(
      "contact tiers",
      () => prisma.solutionTier.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
      [],
    ),
    getSiteSettings(),
  ]);

  const tierNames = tiers.map((t) => t.name);
  const selectedTier = params.plano && tierNames.includes(params.plano) ? params.plano : undefined;

  return (
    <section className="px-6 pb-24 pt-24 sm:pt-32">
      <div className="mx-auto grid max-w-container gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="flex flex-col gap-8">
          <Reveal className="flex flex-col gap-4">
            <span className="eyebrow">{hero.eyebrow}</span>
            <h1 className="text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              {hero.headline}
            </h1>
            <p className="measure text-base leading-relaxed text-muted-foreground">{hero.description}</p>
          </Reveal>

          <Reveal className="flex flex-col gap-6 border-t border-border/60 pt-8">
            {settings.whatsapp ? (
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Prefere conversar
                </span>
                <WhatsAppLink
                  whatsapp={settings.whatsapp}
                  message={settings.whatsappMessage}
                  className="w-fit"
                />
              </div>
            ) : null}

            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">E-mail</span>
              <Link
                href={`mailto:${settings.contactEmail}`}
                className="flex w-fit items-center gap-2 text-sm text-foreground transition-colors hover:text-accent-ink"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden />
                {settings.contactEmail}
              </Link>
            </div>

            {info.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {item.label}
                </span>
                <span className="text-sm text-foreground">{item.value}</span>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <ContactForm
            serviceOptions={services.map((s) => s.title)}
            tierOptions={tierNames}
            defaultService={preselected}
            defaultTier={selectedTier}
          />
        </Reveal>
      </div>
    </section>
  );
}
