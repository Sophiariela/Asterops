import type { Metadata } from "next";
import Link from "next/link";

import { Mail } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { contactContent } from "@/config/content";
import { getInspirationBySlug } from "@/config/inspirations";
import { contactEmail, instagramHandle, instagramUrl } from "@/config/socials";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Talk to Aster about the intelligent digital system your business needs.",
  path: "/contact",
});

interface ContactPageProps {
  searchParams: Promise<{ inspiration?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { hero, info } = contactContent;

  // Visitors arriving via "Build Something Similar" on a Design Inspirations
  // card get the form pre-framed around that reference — see
  // `inspirationContactHref`. The inspiration itself is never sold; this only
  // seeds the message so the conversation starts with the right context.
  const { inspiration: inspirationSlug } = await searchParams;
  const inspiration = inspirationSlug ? getInspirationBySlug(inspirationSlug) : undefined;

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
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Email
              </span>
              <Link
                href={`mailto:${contactEmail}`}
                className="flex w-fit items-center gap-2 text-sm text-foreground transition-colors hover:text-accent"
              >
                <Mail className="h-3.5 w-3.5" />
                {contactEmail}
              </Link>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Instagram
              </span>
              <Link
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit text-sm text-foreground transition-colors hover:text-accent"
              >
                {instagramHandle}
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

        <Reveal className="rounded-lg border border-border bg-card p-8">
          <ContactForm
            {...(inspiration
              ? {
                  contextNote: `Inspired by ${inspiration.name}. Tell us about your business and we'll design a custom solution around it.`,
                  defaultMessage: `I'd like to build something similar in spirit to ${inspiration.name}. `,
                }
              : {})}
          />
        </Reveal>
      </div>
    </section>
  );
}
