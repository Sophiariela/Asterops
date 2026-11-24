import { notFound } from "next/navigation";

import { ServiceForm } from "@/components/admin/service-form";
import { prisma } from "@/lib/prisma";

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;
  const [service, categories] = await Promise.all([
    prisma.service.findUnique({ where: { id } }),
    prisma.serviceCategory.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!service) notFound();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-medium text-foreground">{service.title}</h1>
      <ServiceForm service={service} categories={categories} />
    </div>
  );
}
