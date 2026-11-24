"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { FaqEntry } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function FaqForm({ entry }: { entry?: FaqEntry }) {
  const router = useRouter();
  const [status, setStatus] = React.useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = React.useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const data = new FormData(event.currentTarget);
    const payload = {
      question: String(data.get("question") ?? ""),
      answer: String(data.get("answer") ?? ""),
      published: data.get("published") === "on",
      order: Number(data.get("order") ?? 0),
    };

    setStatus("submitting");
    const response = await fetch(entry ? `/api/admin/faq/${entry.id}` : "/api/admin/faq", {
      method: entry ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(typeof body?.error === "string" ? body.error : "Failed to save entry.");
      setStatus("error");
      return;
    }

    router.push("/admin/faq");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="question">Question</Label>
        <Input id="question" name="question" defaultValue={entry?.question} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="answer">Answer</Label>
        <Textarea id="answer" name="answer" defaultValue={entry?.answer} rows={7} required />
        <p className="text-xs text-muted-foreground">
          Answer honestly — never promise a timeline or an integration that still depends on scope.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="order">Display order</Label>
        <Input id="order" name="order" type="number" defaultValue={entry?.order ?? 0} required />
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" name="published" defaultChecked={entry?.published ?? true} className="h-4 w-4" />
        Published (visible on the public site)
      </label>

      {status === "error" ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : entry ? (
            "Save changes"
          ) : (
            "Create entry"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/faq")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
