import Link from "next/link";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  const categories = await prisma.serviceCategory.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { services: true } } },
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground">
            The four commercial areas of the catalogue. Each one has its own page at
            /solutions/[slug].
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="h-4 w-4" />
            New category
          </Link>
        </Button>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">No categories yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Solutions</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {category.code}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="font-medium text-foreground hover:text-accent-ink"
                    >
                      {category.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {category.slug}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{category._count.services}</td>
                  <td className="px-4 py-3">
                    <Badge variant={category.published ? "default" : "outline"}>
                      {category.published ? "Published" : "Hidden"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton
                      action={`/api/admin/categories/${category.id}`}
                      confirmMessage={`Delete "${category.name}"? Its solutions stay, but lose their category.`}
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
