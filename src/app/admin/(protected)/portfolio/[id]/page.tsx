import { notFound } from "next/navigation";

import { PortfolioForm } from "@/components/admin/portfolio-form";
import { prisma } from "@/lib/prisma";

interface EditPortfolioPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPortfolioProjectPage({ params }: EditPortfolioPageProps) {
  const { id } = await params;
  const project = await prisma.portfolioProject.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium text-foreground">Edit project</h1>
        <p className="text-sm text-muted-foreground">{project.name}</p>
      </div>
      <PortfolioForm project={project} />
    </div>
  );
}
