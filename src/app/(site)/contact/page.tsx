import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { contactContent } from "@/config/content";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Tell us about your project. We'll review your requirements and get back to you with the next steps.",
  path: "/contact",
});

interface ContactPageProps {
  searchParams: Promise<{ service?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { hero, info } = contactContent;
  const { service } = await searchParams;

  const [services, settings] = await Promise.all([
    prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    getSiteSettings(),
  ]);

  return (
    <section className="px-6 pb-24 pt-28 sm:pt-36">
      <div className="mx-auto grid max-w-container gap-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-8">
          <Reveal className="flex flex-col gap-4">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-accent">
              {hero.eyebrow}
            </span>
            <h1 className="text-balance text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              {hero.headline}
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">{hero.description}</p>
          </Reveal>

          <Reveal className="flex flex-col gap-5 border-t border-border/60 pt-8">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Email</span>
              <Link
                href={`mailto:${settings.contactEmail}`}
                className="flex w-fit items-center gap-2 text-sm text-foreground transition-colors hover:text-accent"
              >
                <Mail className="h-3.5 w-3.5" />
                {settings.contactEmail}
              </Link>
            </div>

            {settings.whatsapp ? (
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  WhatsApp
                </span>
                <Link
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit text-sm text-foreground transition-colors hover:text-accent"
                >
                  {settings.whatsapp}
                </Link>
              </div>
            ) : null}

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

        <Reveal className="rounded-lg border border-border bg-card p-8">
          <ContactForm serviceOptions={services.map((s) => s.title)} defaultService={service} />
        </Reveal>
      </div>
    </section>
  );
}
