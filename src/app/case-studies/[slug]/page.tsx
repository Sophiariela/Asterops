import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/shared/json-ld";
import { CaseStudyHero } from "@/components/case-study/case-study-hero";
import { CaseStudyChallenge } from "@/components/case-study/case-study-challenge";
import { CaseStudySolution } from "@/components/case-study/case-study-solution";
import { CaseStudyDeliverables } from "@/components/case-study/case-study-deliverables";
import { CaseStudyGallery } from "@/components/case-study/case-study-gallery";
import { CaseStudyTechnology } from "@/components/case-study/case-study-technology";
import { CaseStudyResults } from "@/components/case-study/case-study-results";
import { CaseStudyCta } from "@/components/case-study/case-study-cta";
import { getCaseStudyBySlug, getCaseStudySlugs } from "@/config/case-studies";
import { buildMetadata, caseStudyJsonLd } from "@/lib/seo";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);
  if (!caseStudy) return {};

  return buildMetadata({
    title: `${caseStudy.client} — Case Study`,
    description: caseStudy.hero.summary,
    path: `/case-studies/${caseStudy.slug}`,
    image: `/case-studies/${caseStudy.slug}/opengraph-image`,
  });
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) notFound();

  return (
    <>
      <JsonLd data={caseStudyJsonLd(caseStudy)} />
      <CaseStudyHero caseStudy={caseStudy} />
      <CaseStudyChallenge caseStudy={caseStudy} />
      <CaseStudySolution caseStudy={caseStudy} />
      <CaseStudyDeliverables caseStudy={caseStudy} />
      <CaseStudyGallery caseStudy={caseStudy} />
      <CaseStudyTechnology caseStudy={caseStudy} />
      <CaseStudyResults caseStudy={caseStudy} />
      <CaseStudyCta caseStudy={caseStudy} />
    </>
  );
}
