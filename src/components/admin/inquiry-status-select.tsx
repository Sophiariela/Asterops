"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

const statuses = ["NEW", "CONTACTED", "DISCOVERY", "PROPOSAL_SENT", "IN_PROGRESS", "COMPLETED", "LOST"] as const;

export function InquiryStatusSelect({ inquiryId, status }: { inquiryId: string; status: string }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setPending(true);
    await fetch(`/api/admin/inquiries/${inquiryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: event.target.value }),
    });
    setPending(false);
    router.refresh();
  }

  return (
    <select
      defaultValue={status}
      onChange={handleChange}
      disabled={pending}
      className="flex h-11 w-full rounded-md border border-border bg-secondary px-4 text-sm text-foreground disabled:opacity-60 sm:w-56"
    >
      {statuses.map((option) => (
        <option key={option} value={option}>
          {option.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
