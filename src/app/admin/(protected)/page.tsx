import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [totalInquiries, newInquiries, activeProjects, publishedProjects, recentInquiries] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.inquiry.count({ where: { status: "IN_PROGRESS" } }),
    prisma.portfolioProject.count({ where: { published: true } }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  const stats = [
    { label: "Total inquiries", value: totalInquiries },
    { label: "New inquiries", value: newInquiries },
    { label: "Active projects", value: activeProjects },
    { label: "Published portfolio projects", value: publishedProjects },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-medium text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">An overview of inquiries and published work.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-6">
            <p className="text-3xl font-medium text-foreground">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-base font-medium text-foreground">Recently received inquiries</h2>
        {recentInquiries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No inquiries yet.</p>
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
                {recentInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <Link href={`/admin/inquiries/${inquiry.id}`} className="font-medium text-foreground hover:text-accent-ink">
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
    </div>
  );
}
