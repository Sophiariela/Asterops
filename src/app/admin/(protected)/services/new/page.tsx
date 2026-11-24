import { ServiceForm } from "@/components/admin/service-form";
import { prisma } from "@/lib/prisma";

export default async function NewServicePage() {
  const categories = await prisma.serviceCategory.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-medium text-foreground">New solution</h1>
      <ServiceForm categories={categories} />
    </div>
  );
}
