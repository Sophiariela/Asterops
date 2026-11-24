import Link from "next/link";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { prisma } from "@/lib/prisma";

export default async function AdminPortfolioPage() {
  const projects = await prisma.portfolioProject.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Portfolio</h1>
          <p className="text-sm text-muted-foreground">Manage the projects shown on the public work page.</p>
        </div>
        <Button asChild>
          <Link href="/admin/portfolio/new">
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Classification</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-muted-foreground">{project.order}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/portfolio/${project.id}`} className="font-medium text-foreground hover:text-accent-ink">
                      {project.name}
                    </Link>
                    {!project.published ? <span className="ml-2 text-xs text-muted-foreground">(hidden)</span> : null}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{project.category}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{project.classification.replace(/_/g, " ")}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{project.status.replace(/_/g, " ")}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton
                      action={`/api/admin/portfolio/${project.id}`}
                      confirmMessage={`Delete "${project.name}"? This can't be undone.`}
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
