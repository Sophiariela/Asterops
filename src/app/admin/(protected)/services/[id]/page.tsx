import { notFound } from "next/navigation";

import { ServiceForm } from "@/components/admin/service-form";
import { prisma } from "@/lib/prisma";

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium text-foreground">Edit service</h1>
        <p className="text-sm text-muted-foreground">{service.title}</p>
      </div>
      <ServiceForm service={service} />
    </div>
  );
}
