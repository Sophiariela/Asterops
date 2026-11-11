"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  confirmMessage,
  redirectTo,
}: {
  action: string;
  confirmMessage: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function handleDelete() {
    if (pending) return;
    if (!window.confirm(confirmMessage)) return;

    setPending(true);
    const response = await fetch(action, { method: "DELETE" });
    setPending(false);

    if (response.ok) {
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } else {
      window.alert("Failed to delete. Please try again.");
    }
  }

  return (
    <Button type="button" variant="ghost" size="icon" onClick={handleDelete} disabled={pending} aria-label="Delete">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}
