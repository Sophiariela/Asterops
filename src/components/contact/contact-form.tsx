"use client";

import * as React from "react";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const inquirySchema = z.object({
  name: z.string().min(2, "Enter your full name."),
  email: z.string().email("Enter a valid email address."),
  businessName: z.string().optional(),
  service: z.string().min(1, "Select the service you need."),
  budget: z.string().optional(),
  message: z.string().min(10, "Tell us a bit more — at least 10 characters."),
  timeline: z.string().optional(),
});

type InquiryValues = z.infer<typeof inquirySchema>;
type Status = "idle" | "submitting" | "success" | "error";

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

export interface ContactFormProps {
  serviceOptions: string[];
  defaultService?: string;
}

export function ContactForm({ serviceOptions, defaultService }: ContactFormProps) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [errors, setErrors] = React.useState<Partial<Record<keyof InquiryValues, string>>>({});
  const [errorMessage, setErrorMessage] = React.useState(DEFAULT_ERROR_MESSAGE);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const values = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      businessName: String(formData.get("businessName") ?? ""),
      service: String(formData.get("service") ?? ""),
      budget: String(formData.get("budget") ?? ""),
      message: String(formData.get("message") ?? ""),
      timeline: String(formData.get("timeline") ?? ""),
    };

    const parsed = inquirySchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof InquiryValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof InquiryValues;
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
          Thank you. Your project inquiry has been received. We&apos;ll review it and get back to you within one
          business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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
        <Label htmlFor="businessName">Business name (optional)</Label>
        <Input id="businessName" name="businessName" placeholder="Company name" autoComplete="organization" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="service">Service required</Label>
          <select
            id="service"
            name="service"
            defaultValue={defaultService ?? ""}
            className="flex h-11 w-full rounded-md border border-border bg-secondary px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>
              Select a service
            </option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </select>
          {errors.service ? <p className="text-xs text-red-400">{errors.service}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="budget">Estimated budget (optional)</Label>
          <Input id="budget" name="budget" placeholder="e.g. $2,000 – $5,000" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="timeline">Expected timeline (optional)</Label>
        <Input id="timeline" name="timeline" placeholder="e.g. Launch in 6 weeks" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Project description</Label>
        <Textarea id="message" name="message" placeholder="Tell us about your business and what you need." />
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
            Send Project Inquiry
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
