import { notFound } from "next/navigation";

import { TierForm } from "@/components/admin/tier-form";
import { prisma } from "@/lib/prisma";

interface EditTierPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTierPage({ params }: EditTierPageProps) {
  const { id } = await params;
  const tier = await prisma.solutionTier.findUnique({ where: { id } });
  if (!tier) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium text-foreground">Edit tier</h1>
        <p className="text-sm text-muted-foreground">{tier.name}</p>
      </div>
      <TierForm tier={tier} />
    </div>
  );
}
