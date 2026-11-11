"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Note {
  id: string;
  content: string;
  createdAt: string | Date;
}

export function InquiryNotes({ inquiryId, notes }: { inquiryId: string; notes: Note[] }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const formData = new FormData(event.currentTarget);
    const content = String(formData.get("content") ?? "").trim();
    if (!content) return;

    setPending(true);
    const response = await fetch(`/api/admin/inquiries/${inquiryId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setPending(false);

    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No internal notes yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {notes.map((note) => (
            <li key={note.id} className="rounded-md border border-border bg-secondary/40 p-3 text-sm">
              <p className="text-foreground">{note.content}</p>
              <p className="mt-1 text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Textarea name="content" placeholder="Add an internal note..." className="min-h-20" />
        <Button type="submit" variant="outline" size="sm" disabled={pending} className="w-fit">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add note"}
        </Button>
      </form>
    </div>
  );
}
