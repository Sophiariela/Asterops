import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { WhatsAppLink } from "@/components/shared/whatsapp-link";
import { contactContent } from "@/config/content";
import { getCategories } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Start a Project",
  description:
    "Tell us what you want to build. Aster replies with a direction, a written scope and a next step — normally within one business day.",
  path: "/contact",
});

interface ContactPageProps {
  /** `category` e `service` vêm do CTA da página de uma solução. */
  searchParams: Promise<{ category?: string; service?: string }>;
}

/** Categoria extra do formulário, para quem não se encaixa no catálogo. */
const OTHER_CATEGORY = "Other";

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { hero, info } = contactContent;
  const params = await searchParams;

  const [categories, settings] = await Promise.all([getCategories(), getSiteSettings()]);

  const categoryOptions = [...categories.map((category) => category.name), OTHER_CATEGORY];
  const serviceOptions = categories.map((category) => ({
    category: category.name,
    services: category.services.map((service) => service.title),
  }));

  // Só aceita pré-seleção que exista de verdade — assim um link antigo ou
  // adulterado não injeta valor arbitrário no select.
  const defaultCategory =
    params.category && categoryOptions.includes(params.category) ? params.category : undefined;
  const allServices = serviceOptions.flatMap((group) => group.services);
  const defaultService =
    params.service && allServices.includes(params.service) ? params.service : undefined;

  return (
    <section className="px-6 pb-24 pt-24 sm:pt-32">
      <div className="mx-auto grid max-w-container gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="flex flex-col gap-8">
          <Reveal className="flex flex-col gap-4">
            <span className="eyebrow">{hero.eyebrow}</span>
            <h1 className="text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              {hero.headline}
            </h1>
            <p className="measure text-base leading-relaxed text-muted-foreground">
              {hero.description}
            </p>
          </Reveal>

          <Reveal className="flex flex-col gap-6 border-t border-border/60 pt-8">
            {settings.whatsapp ? (
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Prefer to talk
                </span>
                <WhatsAppLink
                  whatsapp={settings.whatsapp}
                  message="Hi! I came from the Aster website and I would like to discuss a project."
                  className="w-fit"
                />
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Email
              </span>
              <Link
                href={`mailto:${settings.contactEmail}`}
                className="inline-flex w-fit items-center gap-2 text-sm text-foreground transition-colors hover:text-accent-ink"
              >
                <Mail className="h-4 w-4" aria-hidden />
                {settings.contactEmail}
              </Link>
            </div>

            <dl className="grid gap-5 border-t border-border/60 pt-6 sm:grid-cols-3">
              {info.map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd className="text-sm text-foreground">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal>
          <div className="rounded-xl border border-border bg-card p-7 sm:p-9">
            <ContactForm
              categoryOptions={categoryOptions}
              serviceOptions={serviceOptions}
              defaultCategory={defaultCategory}
              defaultService={defaultService}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
