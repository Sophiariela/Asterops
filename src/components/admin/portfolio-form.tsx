"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioProjectSummary } from "@/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function csvToArray(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function PortfolioForm({ project }: { project?: PortfolioProjectSummary }) {
  const router = useRouter();
  const [slug, setSlug] = React.useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(Boolean(project));
  const [status, setStatus] = React.useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = React.useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      slug,
      category: String(formData.get("category") ?? ""),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      fullDescription: String(formData.get("fullDescription") ?? ""),
      coverImage: String(formData.get("coverImage") ?? "").trim(),
      gallery: linesToArray(String(formData.get("gallery") ?? "")),
      projectUrl: String(formData.get("projectUrl") ?? "").trim(),
      technologies: csvToArray(String(formData.get("technologies") ?? "")),
      classification: String(formData.get("classification") ?? "CLIENT_PROJECT"),
      status: String(formData.get("status") ?? "DELIVERED"),
      published: formData.get("published") === "on",
      order: Number(formData.get("order") ?? 0),
    };

    setStatus("submitting");
    const response = await fetch(project ? `/api/admin/portfolio/${project.id}` : "/api/admin/portfolio", {
      method: project ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(typeof body?.error === "string" ? body.error : "Failed to save project.");
      setStatus("error");
      return;
    }

    router.push("/admin/portfolio");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Project name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={project?.name}
            required
            onChange={(event) => {
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(slugify(event.target.value));
            }}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" defaultValue={project?.category} placeholder="e.g. Website Development" required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="shortDescription">Short description</Label>
        <Textarea id="shortDescription" name="shortDescription" defaultValue={project?.shortDescription} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="fullDescription">Full description</Label>
        <Textarea
          id="fullDescription"
          name="fullDescription"
          defaultValue={project?.fullDescription}
          className="min-h-32"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="coverImage">Cover image URL (optional)</Label>
          <Input id="coverImage" name="coverImage" type="url" defaultValue={project?.coverImage ?? ""} placeholder="https://..." />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="projectUrl">Project URL (optional)</Label>
          <Input id="projectUrl" name="projectUrl" type="url" defaultValue={project?.projectUrl ?? ""} placeholder="https://..." />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="gallery">Gallery image URLs (optional, one per line)</Label>
        <Textarea id="gallery" name="gallery" defaultValue={project?.gallery.join("\n")} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
        <Input id="technologies" name="technologies" defaultValue={project?.technologies.join(", ")} placeholder="Next.js, Tailwind CSS" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="classification">Classification</Label>
          <select
            id="classification"
            name="classification"
            defaultValue={project?.classification ?? "CLIENT_PROJECT"}
            className="flex h-11 w-full rounded-md border border-border bg-secondary px-4 text-sm text-foreground"
          >
            <option value="CLIENT_PROJECT">Client Project</option>
            <option value="INTERNAL_PRODUCT">Internal Product</option>
            <option value="PROTOTYPE">Prototype</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={project?.status ?? "DELIVERED"}
            className="flex h-11 w-full rounded-md border border-border bg-secondary px-4 text-sm text-foreground"
          >
            <option value="LIVE">Live</option>
            <option value="DELIVERED">Delivered</option>
            <option value="IN_PROGRESS">In Progress</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="order">Display order</Label>
          <Input id="order" name="order" type="number" defaultValue={project?.order ?? 0} required />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" name="published" defaultChecked={project?.published ?? true} className="h-4 w-4" />
        Published (visible on the public site)
      </label>

      {status === "error" ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : project ? "Save changes" : "Create project"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/portfolio")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
