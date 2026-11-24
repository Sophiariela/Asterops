"use client";

import * as React from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/** Espelha o schema do servidor em /api/contact — mudou um, muda o outro. */
const inquirySchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  company: z.string().optional(),
  phone: z
    .string()
    .min(7, "Please enter a contact number.")
    .regex(/^[\d\s()+-]+$/, "Use digits, spaces and the characters ( ) + - only."),
  country: z.string().min(2, "Please enter your country."),
  projectCategory: z.string().min(1, "Please choose a project category."),
  service: z.string().optional(),
  message: z.string().min(10, "Tell us a little more — at least 10 characters."),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  referenceUrl: z
    .string()
    .trim()
    .url("Enter a full URL, including https://")
    .optional()
    .or(z.literal("")),
});

type InquiryValues = z.infer<typeof inquirySchema>;
type Status = "idle" | "submitting" | "success" | "error";

const DEFAULT_ERROR = "We could not send that just now. Please try again in a moment.";

const budgets = [
  "Not sure yet",
  "Under $2,000",
  "$2,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "Over $50,000",
];

const timelines = [
  "As soon as possible",
  "In the next few weeks",
  "In the next few months",
  "Still researching",
];

const fieldClass =
  "flex h-11 w-full rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export interface ContactFormProps {
  /** Categorias do catálogo, mais "Other". */
  categoryOptions: string[];
  /** Soluções, agrupadas pelo nome da categoria. */
  serviceOptions: { category: string; services: string[] }[];
  /** Pré-selecionado ao chegar da página de uma solução (`?category=`). */
  defaultCategory?: string;
  /** Pré-selecionado ao chegar da página de uma solução (`?service=`). */
  defaultService?: string;
}

/**
 * Formulário de projeto — o mecanismo de conversão principal do site.
 *
 * Valida no cliente e de novo no servidor. Nunca simula sucesso: o estado de
 * sucesso só aparece depois de a API confirmar a gravação, porque dizer
 * "recebido" sem ter gravado é a pior falha possível aqui.
 */
export function ContactForm({
  categoryOptions,
  serviceOptions,
  defaultCategory,
  defaultService,
}: ContactFormProps) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [errors, setErrors] = React.useState<Partial<Record<keyof InquiryValues, string>>>({});
  const [errorMessage, setErrorMessage] = React.useState(DEFAULT_ERROR);
  const [category, setCategory] = React.useState(defaultCategory ?? "");

  /**
   * Com uma categoria escolhida, o select de serviço mostra só as soluções
   * dela — menos opção errada e menos pedido mal classificado.
   */
  const visibleServices = React.useMemo(() => {
    if (!category) return serviceOptions.flatMap((group) => group.services);
    const group = serviceOptions.find((item) => item.category === category);
    return group ? group.services : [];
  }, [category, serviceOptions]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const parsed = inquirySchema.safeParse(raw);

    if (!parsed.success) {
      const next: Partial<Record<keyof InquiryValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof InquiryValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setStatus("error");
      setErrorMessage("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.success) {
        throw new Error(typeof body?.error === "string" ? body.error : "");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setErrorMessage(error instanceof Error && error.message ? error.message : DEFAULT_ERROR);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded-xl border border-accent/40 bg-card p-8"
      >
        <CheckCircle2 className="h-6 w-6 text-accent-ink" aria-hidden />
        <h2 className="text-xl font-medium tracking-tight text-foreground">
          Thank you for contacting Aster.
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Your project inquiry has been received. Our team will review the details and get back to
          you — normally within one business day.
        </p>
        <Button variant="outline" onClick={() => setStatus("idle")}>
          Send another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} />
          {errors.name ? <p className="text-sm text-red-400">{errors.name}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? <p className="text-sm text-red-400">{errors.email}</p> : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="company">Company name</Label>
          <Input
            id="company"
            name="company"
            autoComplete="organization"
            placeholder="Optional"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">WhatsApp / phone</Label>
          <Input
            id="phone"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone ? <p className="text-sm text-red-400">{errors.phone}</p> : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            autoComplete="country-name"
            aria-invalid={Boolean(errors.country)}
          />
          {errors.country ? <p className="text-sm text-red-400">{errors.country}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="projectCategory">Project category</Label>
          <select
            id="projectCategory"
            name="projectCategory"
            className={fieldClass}
            defaultValue={defaultCategory ?? ""}
            onChange={(event) => setCategory(event.target.value)}
            aria-invalid={Boolean(errors.projectCategory)}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.projectCategory ? (
            <p className="text-sm text-red-400">{errors.projectCategory}</p>
          ) : null}
        </div>
      </div>

      {visibleServices.length > 0 ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="service">Specific solution</Label>
          <select
            id="service"
            name="service"
            className={fieldClass}
            defaultValue={defaultService ?? ""}
          >
            <option value="">Not sure yet</option>
            {visibleServices.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">What do you want to build?</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          placeholder="What the business does, what is not working today, and what you want this to do."
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message ? <p className="text-sm text-red-400">{errors.message}</p> : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="budget">Estimated budget (optional)</Label>
          <select id="budget" name="budget" className={fieldClass} defaultValue="">
            <option value="">Prefer not to say</option>
            {budgets.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="timeline">Desired timeline (optional)</Label>
          <select id="timeline" name="timeline" className={fieldClass} defaultValue="">
            <option value="">Not sure yet</option>
            {timelines.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="referenceUrl">Reference URL (optional)</Label>
        <Input
          id="referenceUrl"
          name="referenceUrl"
          inputMode="url"
          placeholder="https://example.com — a current site, or something you like"
          aria-invalid={Boolean(errors.referenceUrl)}
        />
        {errors.referenceUrl ? (
          <p className="text-sm text-red-400">{errors.referenceUrl}</p>
        ) : null}
      </div>

      {status === "error" ? (
        <p role="alert" className="text-sm text-red-400">
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-fit">
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          <>
            Start a Project
            <Send className="h-4 w-4" aria-hidden />
          </>
        )}
      </Button>
    </form>
  );
}
