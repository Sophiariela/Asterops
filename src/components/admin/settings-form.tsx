"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { SiteSettings } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = React.useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const formData = new FormData(event.currentTarget);
    const payload = {
      studioName: String(formData.get("studioName") ?? ""),
      contactEmail: String(formData.get("contactEmail") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? ""),
      whatsappMessage: String(formData.get("whatsappMessage") ?? ""),
      instagramUrl: String(formData.get("instagramUrl") ?? ""),
      ctaLabel: String(formData.get("ctaLabel") ?? ""),
      ctaHref: String(formData.get("ctaHref") ?? ""),
      footerNote: String(formData.get("footerNote") ?? ""),
      heroEyebrow: String(formData.get("heroEyebrow") ?? ""),
      heroHeadline: String(formData.get("heroHeadline") ?? ""),
      heroSubheadline: String(formData.get("heroSubheadline") ?? ""),
      heroPrimaryCta: String(formData.get("heroPrimaryCta") ?? ""),
      heroSecondaryCta: String(formData.get("heroSecondaryCta") ?? ""),
    };

    setStatus("submitting");
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(typeof body?.error === "string" ? body.error : "Failed to save settings.");
      setStatus("error");
      return;
    }

    setStatus("success");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="studioName">Studio name</Label>
        <Input id="studioName" name="studioName" defaultValue={settings.studioName} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contactEmail">Contact email</Label>
        <Input id="contactEmail" name="contactEmail" type="email" defaultValue={settings.contactEmail} required />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="whatsapp">WhatsApp (optional)</Label>
          <Input id="whatsapp" name="whatsapp" defaultValue={settings.whatsapp ?? ""} placeholder="+55 11 99999-9999" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="instagramUrl">Instagram URL (optional)</Label>
          <Input id="instagramUrl" name="instagramUrl" type="url" defaultValue={settings.instagramUrl ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="whatsappMessage">WhatsApp prefilled message</Label>
        <Textarea
          id="whatsappMessage"
          name="whatsappMessage"
          defaultValue={settings.whatsappMessage}
          rows={2}
          required
        />
        <p className="text-xs text-muted-foreground">
          Text already typed when someone opens WhatsApp from the site. The button only renders when a number
          is set above.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="ctaLabel">Main CTA label</Label>
          <Input id="ctaLabel" name="ctaLabel" defaultValue={settings.ctaLabel} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="ctaHref">Main CTA link</Label>
          <Input id="ctaHref" name="ctaHref" defaultValue={settings.ctaHref} required />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="footerNote">Footer note</Label>
        <Textarea id="footerNote" name="footerNote" defaultValue={settings.footerNote} required />
      </div>

      <fieldset className="flex flex-col gap-5 rounded-lg border border-border p-5">
        <legend className="px-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Home hero
        </legend>
        <p className="text-xs text-muted-foreground">
          Leave a field empty to fall back to the default copy in <code>src/config/content.ts</code>.
        </p>

        <div className="flex flex-col gap-2">
          <Label htmlFor="heroEyebrow">Eyebrow</Label>
          <Input id="heroEyebrow" name="heroEyebrow" defaultValue={settings.heroEyebrow} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="heroHeadline">Headline</Label>
          <Textarea id="heroHeadline" name="heroHeadline" defaultValue={settings.heroHeadline} rows={2} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="heroSubheadline">Supporting copy</Label>
          <Textarea
            id="heroSubheadline"
            name="heroSubheadline"
            defaultValue={settings.heroSubheadline}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="heroPrimaryCta">Primary CTA label</Label>
            <Input id="heroPrimaryCta" name="heroPrimaryCta" defaultValue={settings.heroPrimaryCta} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="heroSecondaryCta">Secondary CTA label</Label>
            <Input id="heroSecondaryCta" name="heroSecondaryCta" defaultValue={settings.heroSecondaryCta} />
          </div>
        </div>
      </fieldset>

      {status === "error" ? <p className="text-sm text-red-400">{error}</p> : null}
      {status === "success" ? <p className="text-sm text-accent-ink">Settings saved.</p> : null}

      <Button type="submit" disabled={status === "submitting"} className="w-fit">
        {status === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save settings"}
      </Button>
    </form>
  );
}
