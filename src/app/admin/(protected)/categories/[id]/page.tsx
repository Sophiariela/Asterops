import { notFound } from "next/navigation";

import { CategoryForm } from "@/components/admin/category-form";
import { prisma } from "@/lib/prisma";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const category = await prisma.serviceCategory.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-medium text-foreground">{category.name}</h1>
      <CategoryForm category={category} />
    </div>
  );
}
