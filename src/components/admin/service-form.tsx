"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { serviceIconNames } from "@/lib/service-icons";

export interface ServiceFormValues {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  active: boolean;
  order: number;
  categoryId: string | null;
  outcome: string;
  headline: string;
  problem: string;
  idealCustomer: string;
  capabilities: string[];
  functionality: string[];
  useCases: string[];
  integrations: string[];
  scopeNotes: string;
  implementationNote: string;
  commercialModel: string;
  availability: string;
  priceLabel: string;
  ctaLabel: string;
  previewImage: string | null;
  previewCaption: string | null;
  featured: boolean;
}

export interface CategoryOption {
  id: string;
  name: string;
}

const COMMERCIAL_MODELS = [
  { value: "FIXED_SCOPE", label: "Fixed-scope project" },
  { value: "CUSTOM_QUOTE", label: "Custom project quote" },
  { value: "SETUP_PLUS_MAINTENANCE", label: "Setup + recurring maintenance" },
  { value: "SUBSCRIPTION", label: "Product subscription" },
];

const AVAILABILITY = [
  { value: "OPERATIONAL_PRODUCT", label: "Operational product" },
  { value: "CUSTOM_DEVELOPMENT", label: "Custom development" },
  { value: "DEMONSTRATION", label: "Demonstration" },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Lista editada como texto: um item por linha, linha vazia descartada. */
function toLines(value: string[]): string {
  return value.join("\n");
}

function fromLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const fieldClass =
  "flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function ListField({
  id,
  label,
  hint,
  defaultValue,
}: {
  id: string;
  label: string;
  hint: string;
  defaultValue: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} name={id} rows={5} defaultValue={toLines(defaultValue)} />
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-5 rounded-lg border border-border p-6">
      <legend className="px-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

/**
 * Formulário de uma solução do catálogo.
 *
 * Cobre tanto o cartão de listagem quanto a página de detalhe, porque é o
 * mesmo registro. Agrupado em blocos para não virar uma parede de campo: o
 * que aparece no cartão, o que aparece na página, e o comercial.
 */
export function ServiceForm({
  service,
  categories,
}: {
  service?: ServiceFormValues;
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [slug, setSlug] = React.useState(service?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(Boolean(service));
  const [status, setStatus] = React.useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = React.useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const formData = new FormData(event.currentTarget);
    const text = (key: string) => String(formData.get(key) ?? "");
    const categoryId = text("categoryId");

    const payload = {
      title: text("title"),
      slug,
      description: text("description"),
      icon: text("icon") || "Sparkles",
      active: formData.get("active") === "on",
      order: Number(formData.get("order") ?? 0),
      categoryId: categoryId || null,
      outcome: text("outcome"),
      headline: text("headline"),
      problem: text("problem"),
      idealCustomer: text("idealCustomer"),
      capabilities: fromLines(text("capabilities")),
      functionality: fromLines(text("functionality")),
      useCases: fromLines(text("useCases")),
      integrations: fromLines(text("integrations")),
      scopeNotes: text("scopeNotes"),
      implementationNote: text("implementationNote"),
      commercialModel: text("commercialModel"),
      availability: text("availability"),
      priceLabel: text("priceLabel") || "Request a project estimate.",
      ctaLabel: text("ctaLabel") || "Start a Project",
      previewImage: text("previewImage") || null,
      previewCaption: text("previewCaption") || null,
      featured: formData.get("featured") === "on",
    };

    setStatus("submitting");
    const response = await fetch(
      service ? `/api/admin/services/${service.id}` : "/api/admin/services",
      {
        method: service ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(typeof body?.error === "string" ? body.error : "Failed to save solution.");
      setStatus("error");
      return;
    }

    router.push("/admin/services");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-6">
      <Fieldset title="Listing card">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={service?.title ?? ""}
              onChange={(event) => {
                if (!slugTouched) setSlug(slugify(event.target.value));
              }}
              required
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
                setSlug(event.target.value);
              }}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            name="categoryId"
            className={fieldClass}
            defaultValue={service?.categoryId ?? ""}
          >
            <option value="">No category (hidden from the catalogue)</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            A solution without a category still exists, but does not appear under /solutions.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="outcome">Outcome (one line)</Label>
          <Input id="outcome" name="outcome" defaultValue={service?.outcome ?? ""} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Card description</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={service?.description ?? ""}
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="icon">Icon</Label>
            <select
              id="icon"
              name="icon"
              className={fieldClass}
              defaultValue={service?.icon ?? "Sparkles"}
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
            <Input id="order" name="order" type="number" defaultValue={service?.order ?? 0} />
          </div>
          <div className="flex flex-col justify-end gap-3 pb-2">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                name="active"
                defaultChecked={service ? service.active : true}
                className="h-4 w-4 rounded border-input"
              />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={service?.featured ?? false}
                className="h-4 w-4 rounded border-input"
              />
              Featured on home
            </label>
          </div>
        </div>
      </Fieldset>

      <Fieldset title="Detail page">
        <div className="flex flex-col gap-2">
          <Label htmlFor="headline">Headline</Label>
          <Textarea id="headline" name="headline" rows={2} defaultValue={service?.headline ?? ""} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="problem">The problem it solves</Label>
          <Textarea id="problem" name="problem" rows={4} defaultValue={service?.problem ?? ""} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="idealCustomer">Who it is for</Label>
          <Textarea
            id="idealCustomer"
            name="idealCustomer"
            rows={3}
            defaultValue={service?.idealCustomer ?? ""}
          />
        </div>

        <ListField
          id="capabilities"
          label="Main capabilities"
          hint="One per line."
          defaultValue={service?.capabilities ?? []}
        />
        <ListField
          id="functionality"
          label="Detailed functionality"
          hint="One per line. This is what stops the page being a shallow card."
          defaultValue={service?.functionality ?? []}
        />
        <ListField
          id="useCases"
          label="Example use cases"
          hint="One per line."
          defaultValue={service?.useCases ?? []}
        />
        <ListField
          id="integrations"
          label="Optional integrations"
          hint="One per line. Only list what is genuinely possible."
          defaultValue={service?.integrations ?? []}
        />

        <div className="flex flex-col gap-2">
          <Label htmlFor="implementationNote">How implementation works</Label>
          <Textarea
            id="implementationNote"
            name="implementationNote"
            rows={3}
            defaultValue={service?.implementationNote ?? ""}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="scopeNotes">Scope and customisation</Label>
          <Textarea
            id="scopeNotes"
            name="scopeNotes"
            rows={4}
            defaultValue={service?.scopeNotes ?? ""}
          />
          <p className="text-xs text-muted-foreground">
            State what depends on scope or on third-party approval here, rather than implying it is
            ready to switch on.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="previewImage">Preview image path</Label>
            <Input
              id="previewImage"
              name="previewImage"
              defaultValue={service?.previewImage ?? ""}
              placeholder="/projects/example.webp"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="previewCaption">Preview caption</Label>
            <Input
              id="previewCaption"
              name="previewCaption"
              defaultValue={service?.previewCaption ?? ""}
              placeholder="Client project — … / Product demonstration"
            />
          </div>
        </div>
      </Fieldset>

      <Fieldset title="Commercial">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="commercialModel">Commercial model</Label>
            <select
              id="commercialModel"
              name="commercialModel"
              className={fieldClass}
              defaultValue={service?.commercialModel ?? "CUSTOM_QUOTE"}
            >
              {COMMERCIAL_MODELS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="availability">Availability</Label>
            <select
              id="availability"
              name="availability"
              className={fieldClass}
              defaultValue={service?.availability ?? "CUSTOM_DEVELOPMENT"}
            >
              {AVAILABILITY.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Only use &ldquo;Operational product&rdquo; for software that already runs.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="priceLabel">Price label</Label>
            <Input
              id="priceLabel"
              name="priceLabel"
              defaultValue={service?.priceLabel ?? "Request a project estimate."}
            />
            <p className="text-xs text-muted-foreground">
              Shown as written. Leave the estimate wording unless a price is actually set.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ctaLabel">CTA label</Label>
            <Input
              id="ctaLabel"
              name="ctaLabel"
              defaultValue={service?.ctaLabel ?? "Start a Project"}
            />
          </div>
        </div>
      </Fieldset>

      {status === "error" ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {service ? "Save changes" : "Create solution"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
