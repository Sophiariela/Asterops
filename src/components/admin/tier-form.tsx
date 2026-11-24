"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { SolutionTier } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Editor de nível comercial.
 *
 * `priceLabel` e `setupLabel` são texto livre de propósito: enquanto o
 * estúdio não fechar tabela, o site mostra "Solicite uma proposta" em vez
 * de número inventado. As inclusões entram uma por linha.
 */
export function TierForm({ tier }: { tier?: SolutionTier }) {
  const router = useRouter();
  const [slug, setSlug] = React.useState(tier?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(Boolean(tier));
  const [status, setStatus] = React.useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = React.useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name") ?? ""),
      slug,
      audience: String(data.get("audience") ?? ""),
      problem: String(data.get("problem") ?? ""),
      outcome: String(data.get("outcome") ?? ""),
      inclusions: String(data.get("inclusions") ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      customization: String(data.get("customization") ?? ""),
      implementation: String(data.get("implementation") ?? ""),
      priceLabel: String(data.get("priceLabel") ?? ""),
      setupLabel: String(data.get("setupLabel") ?? ""),
      featured: data.get("featured") === "on",
      published: data.get("published") === "on",
      order: Number(data.get("order") ?? 0),
    };

    setStatus("submitting");
    const response = await fetch(tier ? `/api/admin/tiers/${tier.id}` : "/api/admin/tiers", {
      method: tier ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(typeof body?.error === "string" ? body.error : "Failed to save tier.");
      setStatus("error");
      return;
    }

    router.push("/admin/tiers");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={tier?.name}
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
        <Label htmlFor="audience">Who it is for</Label>
        <Textarea id="audience" name="audience" defaultValue={tier?.audience} rows={2} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="problem">Problem it solves</Label>
        <Textarea id="problem" name="problem" defaultValue={tier?.problem} rows={2} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="outcome">Primary outcome</Label>
        <Input id="outcome" name="outcome" defaultValue={tier?.outcome} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="inclusions">What is included (one per line)</Label>
        <Textarea
          id="inclusions"
          name="inclusions"
          defaultValue={tier?.inclusions.join("\n")}
          rows={7}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="customization">What is customized</Label>
        <Textarea id="customization" name="customization" defaultValue={tier?.customization} rows={2} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="implementation">How implementation works</Label>
        <Textarea
          id="implementation"
          name="implementation"
          defaultValue={tier?.implementation}
          rows={2}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="priceLabel">Price label</Label>
        <Input
          id="priceLabel"
          name="priceLabel"
          defaultValue={tier?.priceLabel ?? "Solicite uma proposta personalizada."}
          required
        />
        <p className="text-xs text-muted-foreground">
          Free text — publish a real figure only once pricing is approved. Otherwise leave the request-a-quote
          wording.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="setupLabel">Implementation fee label</Label>
        <Input
          id="setupLabel"
          name="setupLabel"
          defaultValue={tier?.setupLabel ?? "Implementação sob escopo, orçada no diagnóstico."}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="order">Display order</Label>
        <Input id="order" name="order" type="number" defaultValue={tier?.order ?? 0} required />
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" name="featured" defaultChecked={tier?.featured ?? false} className="h-4 w-4" />
        Highlighted tier
      </label>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" name="published" defaultChecked={tier?.published ?? true} className="h-4 w-4" />
        Published (visible on the public site)
      </label>

      {status === "error" ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : tier ? (
            "Save changes"
          ) : (
            "Create tier"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/tiers")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
