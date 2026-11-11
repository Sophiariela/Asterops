import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const statuses = ["NEW", "CONTACTED", "DISCOVERY", "PROPOSAL_SENT", "IN_PROGRESS", "COMPLETED", "LOST"] as const;

interface AdminInquiriesPageProps {
  searchParams: Promise<{ status?: string; service?: string; q?: string }>;
}

export default async function AdminInquiriesPage({ searchParams }: AdminInquiriesPageProps) {
  const { status, service, q } = await searchParams;

  const where: Prisma.InquiryWhereInput = {};
  if (status) where.status = status as Prisma.InquiryWhereInput["status"];
  if (service) where.service = service;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  const [inquiries, services] = await Promise.all([
    prisma.inquiry.findMany({ where, orderBy: { createdAt: "desc" } }),
    prisma.service.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium text-foreground">Inquiries</h1>
        <p className="text-sm text-muted-foreground">Project inquiries submitted through the contact form.</p>
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search name or email"
          className="h-10 rounded-md border border-border bg-secondary px-3 text-sm text-foreground"
        />
        <select name="status" defaultValue={status ?? ""} className="h-10 rounded-md border border-border bg-secondary px-3 text-sm text-foreground">
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <select name="service" defaultValue={service ?? ""} className="h-10 rounded-md border border-border bg-secondary px-3 text-sm text-foreground">
          <option value="">All services</option>
          {services.map((s) => (
            <option key={s.id} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
        <button type="submit" className="h-10 rounded-md border border-border px-4 text-sm text-foreground hover:bg-secondary">
          Filter
        </button>
      </form>

      {inquiries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No inquiries match these filters.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Received</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/inquiries/${inquiry.id}`} className="font-medium text-foreground hover:text-accent">
                      {inquiry.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{inquiry.service ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{inquiry.status.replace(/_/g, " ")}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {inquiry.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
