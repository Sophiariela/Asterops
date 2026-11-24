import Link from "next/link";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { prisma } from "@/lib/prisma";

export default async function AdminTiersPage() {
  const tiers = await prisma.solutionTier.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Solution tiers</h1>
          <p className="text-sm text-muted-foreground">
            The three commercial entry points shown on the home and solutions pages.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tiers/new">
            <Plus className="h-4 w-4" />
            New tier
          </Link>
        </Button>
      </div>

      {tiers.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tiers yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price label</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier) => (
                <tr key={tier.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-muted-foreground">{tier.order}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/tiers/${tier.id}`}
                      className="font-medium text-foreground hover:text-accent-ink"
                    >
                      {tier.name}
                    </Link>
                    {tier.featured ? (
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-wide text-accent-ink">
                        highlighted
                      </span>
                    ) : null}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">{tier.priceLabel}</td>
                  <td className="px-4 py-3">
                    <Badge variant={tier.published ? "default" : "outline"}>
                      {tier.published ? "Published" : "Hidden"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton
                      action={`/api/admin/tiers/${tier.id}`}
                      confirmMessage={`Delete "${tier.name}"? This can't be undone.`}
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
