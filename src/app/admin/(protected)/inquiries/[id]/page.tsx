import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { DeleteButton } from "@/components/admin/delete-button";
import { InquiryStatusSelect } from "@/components/admin/inquiry-status-select";
import { InquiryNotes } from "@/components/admin/inquiry-notes";
import { WhatsAppLink } from "@/components/shared/whatsapp-link";
import { prisma } from "@/lib/prisma";

interface AdminInquiryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminInquiryDetailPage({ params }: AdminInquiryDetailPageProps) {
  const { id } = await params;
  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: { notes: { orderBy: { createdAt: "desc" } } },
  });
  if (!inquiry) notFound();

  const fields: { label: string; value: string }[] = [
    { label: "Email", value: inquiry.email },
    { label: "WhatsApp", value: inquiry.whatsapp ?? "—" },
    { label: "Business name", value: inquiry.businessName ?? "—" },
    { label: "Business type", value: inquiry.businessType ?? "—" },
    { label: "Needs", value: inquiry.service ?? "—" },
    { label: "Budget", value: inquiry.budget ?? "—" },
    { label: "Timeline", value: inquiry.timeline ?? "—" },
    { label: "Received", value: inquiry.createdAt.toLocaleString("pt-BR") },
  ];

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div className="flex items-center justify-between">
        <Link href="/admin/inquiries" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to inquiries
        </Link>
        <DeleteButton
          action={`/api/admin/inquiries/${inquiry.id}`}
          confirmMessage="Delete this inquiry? This can't be undone."
          redirectTo="/admin/inquiries"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-medium text-foreground">{inquiry.name}</h1>
        {inquiry.whatsapp ? (
          <WhatsAppLink
            whatsapp={inquiry.whatsapp}
            message={`Oi, ${inquiry.name.split(" ")[0]}! Aqui é da Aster, sobre o seu pedido de diagnóstico.`}
            label="Responder no WhatsApp"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Status</span>
        <InquiryStatusSelect inquiryId={inquiry.id} status={inquiry.status} />
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-lg border border-border bg-card p-6 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-1">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">{field.label}</span>
            <span className="text-sm text-foreground">{field.value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          What they want to solve
        </span>
        <p className="whitespace-pre-line rounded-lg border border-border bg-card p-6 text-sm leading-relaxed text-foreground">
          {inquiry.message}
        </p>
      </div>

      {inquiry.problem ? (
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            What gets in the way today
          </span>
          <p className="whitespace-pre-line rounded-lg border border-border bg-card p-6 text-sm leading-relaxed text-foreground">
            {inquiry.problem}
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Internal notes</span>
        <InquiryNotes inquiryId={inquiry.id} notes={inquiry.notes} />
      </div>
    </div>
  );
}
