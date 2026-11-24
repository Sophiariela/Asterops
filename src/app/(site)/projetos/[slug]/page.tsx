import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { CtaSection } from "@/components/sections/cta-section";
import { classificationLabel, statusLabel } from "@/components/portfolio/portfolio-card";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { buildMetadata } from "@/lib/seo";

interface PortfolioDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  // Falha de leitura cai em `null`, que o chamador trata como 404 — melhor
  // que estourar erro de servidor numa página de projeto.
  return safeQuery(
    `project "${slug}"`,
    () => prisma.portfolioProject.findFirst({ where: { slug, published: true } }),
    null,
  );
}

export async function generateStaticParams() {
  const projects = await safeQuery(
    "project slugs",
    () =>
      prisma.portfolioProject.findMany({
        where: { published: true },
        select: { slug: true },
      }),
    [] as { slug: string }[],
  );
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PortfolioDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  return buildMetadata({
    title: project.name,
    description: project.shortDescription,
    path: `/projetos/${project.slug}`,
  });
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <>
      <section className="px-6 pb-16 pt-28 sm:pt-36">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <Link
            href="/projetos"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para projetos
          </Link>

          <Reveal className="flex flex-wrap items-center gap-2">
            <Badge>{project.category}</Badge>
            <Badge variant="outline">{classificationLabel[project.classification]}</Badge>
            <Badge variant="outline">{statusLabel[project.status]}</Badge>
          </Reveal>

          <Reveal>
            <h1 className="text-balance text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              {project.name}
            </h1>
          </Reveal>

          <Reveal>
            <p className="text-lg leading-relaxed text-muted-foreground">{project.shortDescription}</p>
          </Reveal>

          {project.projectUrl ? (
            <Reveal>
              <Button asChild variant="outline" size="sm" className="w-fit">
                <Link href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                  Abrir o projeto
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </Reveal>
          ) : null}
        </div>
      </section>

      {project.coverImage ? (
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.coverImage} alt={`Captura de tela do projeto ${project.name}.`} className="w-full object-cover" />
          </div>
        </section>
      ) : null}

      <section className="border-t border-border/60 px-6 py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <Reveal className="flex flex-col gap-4">
            <h2 className="text-xl font-medium text-foreground">Sobre o projeto</h2>
            <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
              {project.fullDescription}
            </p>
          </Reveal>

          {project.technologies.length > 0 ? (
            <Reveal className="flex flex-col gap-3">
              <h3 className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Tecnologias
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Reveal>
          ) : null}

          {project.gallery.length > 0 ? (
            <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.gallery.map((image) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={image}
                  src={image}
                  alt={`Captura de tela do projeto ${project.name}.`}
                  className="rounded-lg border border-border object-cover"
                />
              ))}
            </Reveal>
          ) : null}
        </div>
      </section>

      <CtaSection
        title="Seu negócio precisa de algo parecido?"
        description="Conte o que você precisa. A Aster encontra a solução e cuida da implementação."
        primaryCta={{ label: "Solicitar diagnóstico", href: "/contato" }}
        secondaryCta={{ label: "Ver projetos", href: "/projetos" }}
      />
    </>
  );
}
