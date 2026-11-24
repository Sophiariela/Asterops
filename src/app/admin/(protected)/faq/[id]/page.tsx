import { notFound } from "next/navigation";

import { FaqForm } from "@/components/admin/faq-form";
import { prisma } from "@/lib/prisma";

interface EditFaqPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFaqPage({ params }: EditFaqPageProps) {
  const { id } = await params;
  const entry = await prisma.faqEntry.findUnique({ where: { id } });
  if (!entry) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium text-foreground">Edit FAQ entry</h1>
        <p className="text-sm text-muted-foreground">{entry.question}</p>
      </div>
      <FaqForm entry={entry} />
    </div>
  );
}
