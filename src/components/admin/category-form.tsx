"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { serviceIconNames } from "@/lib/service-icons";

export interface CategoryFormValues {
  id: string;
  code: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
  order: number;
  published: boolean;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const fieldClass =
  "flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function CategoryForm({ category }: { category?: CategoryFormValues }) {
  const router = useRouter();
  const [slug, setSlug] = React.useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(Boolean(category));
  const [status, setStatus] = React.useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = React.useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const formData = new FormData(event.currentTarget);
    const payload = {
      code: String(formData.get("code") ?? ""),
      name: String(formData.get("name") ?? ""),
      slug,
      tagline: String(formData.get("tagline") ?? ""),
      description: String(formData.get("description") ?? ""),
      icon: String(formData.get("icon") ?? "Sparkles"),
      order: Number(formData.get("order") ?? 0),
      published: formData.get("published") === "on",
    };

    setStatus("submitting");
    const response = await fetch(
      category ? `/api/admin/categories/${category.id}` : "/api/admin/categories",
      {
        method: category ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(typeof body?.error === "string" ? body.error : "Failed to save category.");
      setStatus("error");
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-[120px_minmax(0,1fr)]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="code">Code</Label>
          <Input id="code" name="code" defaultValue={category?.code ?? ""} placeholder="01" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={category?.name ?? ""}
            onChange={(event) => {
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          required
        />
        <p className="text-xs text-muted-foreground">
          Used in the public URL: /solutions/{slug || "category-slug"}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" name="tagline" defaultValue={category?.tagline ?? ""} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={category?.description ?? ""}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="icon">Icon</Label>
          <select
            id="icon"
            name="icon"
            className={fieldClass}
            defaultValue={category?.icon ?? "Sparkles"}
          >
            {serviceIconNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={category?.order ?? 0}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="published"
          defaultChecked={category ? category.published : true}
          className="h-4 w-4 rounded border-input"
        />
        Published
      </label>

      {status === "error" ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {category ? "Save changes" : "Create category"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
