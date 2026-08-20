"use client";

import * as React from "react";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { productInterestOptions } from "@/config/contact";

const contactSchema = z.object({
  name: z.string().min(2, "Enter your full name."),
  email: z.string().email("Enter a valid email address."),
  company: z.string().optional(),
  productInterest: z.enum(productInterestOptions, {
    errorMap: () => ({ message: "Select the product you're interested in." }),
  }),
  message: z.string().min(10, "Tell us a bit more — at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;
type Status = "idle" | "submitting" | "success" | "error";

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

export interface ContactFormProps {
  /** Preselects the product dropdown — validated against the allowed options. */
  defaultProductInterest?: string;
  /** Seeds the message field, e.g. when arriving from a template page. */
  defaultMessage?: string;
  /** Short line above the form explaining the prefilled context. */
  contextNote?: string;
}

export function ContactForm({ defaultProductInterest, defaultMessage, contextNote }: ContactFormProps = {}) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [errors, setErrors] = React.useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [errorMessage, setErrorMessage] = React.useState(DEFAULT_ERROR_MESSAGE);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const values = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
      productInterest: String(formData.get("productInterest") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof ContactFormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof ContactFormValues;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(typeof body?.error === "string" ? body.error : undefined);
      }
      setStatus("success");
      event.currentTarget.reset();
    } catch (error) {
      setErrorMessage(error instanceof Error && error.message ? error.message : DEFAULT_ERROR_MESSAGE);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-accent/30 bg-accent/[0.04] p-8">
        <p className="text-sm leading-relaxed text-foreground">
          Thank you. Your request has been received. We will contact you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {contextNote ? (
        <p className="rounded-md border border-accent/30 bg-accent/[0.06] px-4 py-3 text-sm leading-relaxed text-foreground">
          {contextNote}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" placeholder="Jane Doe" autoComplete="name" />
          {errors.name ? <p className="text-xs text-red-400">{errors.name}</p> : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="jane@company.com" autoComplete="email" />
          {errors.email ? <p className="text-xs text-red-400">{errors.email}</p> : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="company">Company (optional)</Label>
        <Input id="company" name="company" placeholder="Company name" autoComplete="organization" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="productInterest">Product interest</Label>
        <select
          id="productInterest"
          name="productInterest"
          defaultValue={defaultProductInterest ?? ""}
          className="flex h-11 w-full rounded-md border border-border bg-secondary px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" disabled>
            Select a product
          </option>
          {productInterestOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.productInterest ? <p className="text-xs text-red-400">{errors.productInterest}</p> : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">What are you trying to build?</Label>
        <Textarea
          id="message"
          name="message"
          defaultValue={defaultMessage}
          placeholder="Tell us about your business and what you need."
        />
        {errors.message ? <p className="text-xs text-red-400">{errors.message}</p> : null}
      </div>

      {status === "error" ? <p className="text-sm text-red-400">{errorMessage}</p> : null}

      <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-fit">
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending
          </>
        ) : (
          <>
            Send Message
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
