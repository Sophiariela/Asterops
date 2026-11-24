import Link from "next/link";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { prisma } from "@/lib/prisma";

export default async function AdminFaqPage() {
  const entries = await prisma.faqEntry.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-foreground">FAQ</h1>
          <p className="text-sm text-muted-foreground">Objections answered before the first call.</p>
        </div>
        <Button asChild>
          <Link href="/admin/faq/new">
            <Plus className="h-4 w-4" />
            New entry
          </Link>
        </Button>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No entries yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-muted-foreground">{entry.order}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/faq/${entry.id}`}
                      className="font-medium text-foreground hover:text-accent-ink"
                    >
                      {entry.question}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={entry.published ? "default" : "outline"}>
                      {entry.published ? "Published" : "Hidden"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton
                      action={`/api/admin/faq/${entry.id}`}
                      confirmMessage="Delete this FAQ entry? This can't be undone."
                    />
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
