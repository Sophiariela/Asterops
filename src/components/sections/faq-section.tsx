import { SectionHeading } from "@/components/shared/section-heading";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { homeContent } from "@/config/content";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";

/** Dúvidas que aparecem antes de fechar. Conteúdo editável pelo painel. */
export async function FaqSection() {
  const { faq } = homeContent;
  const entries = await safeQuery(
    "FAQ entries",
    () =>
      prisma.faqEntry.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    [],
  );

  if (entries.length === 0) return null;

  return (
    <section id="duvidas" className="scroll-mt-24 border-b border-border/60 px-6 py-24">
      <div className="mx-auto grid max-w-container gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <SectionHeading eyebrow={faq.eyebrow} title={faq.title} description={faq.description} />
        <FaqAccordion items={entries.map((e) => ({ question: e.question, answer: e.answer }))} />
      </div>
    </section>
  );
}
