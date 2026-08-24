"use client";

import * as React from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "deliverables", label: "Deliverables" },
  { id: "messages", label: "Messages" },
  { id: "documents", label: "Documents" },
  { id: "billing", label: "Billing" },
  { id: "support", label: "Support" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span aria-hidden className="h-px w-6 shrink-0 bg-accent" />
      <h2 className="text-xl font-medium text-foreground">{children}</h2>
    </div>
  );
}

function Tag({ tone = "neutral", children }: { tone?: "neutral" | "accent"; children: React.ReactNode }) {
  return (
    <span
      className={`shrink-0 rounded-full border px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] ${
        tone === "accent" ? "border-accent/45 text-accent" : "border-border text-muted-foreground"
      }`}
    >
      {children}
    </span>
  );
}

const deliverables = [
  { name: "Storefront design system", type: "Design", status: "Delivered", tone: "neutral", date: "Jul 12" },
  { name: "Wholesale portal wireframes", type: "UX", status: "In review", tone: "accent", date: "Jul 28" },
  { name: "Checkout flow spec", type: "Documentation", status: "Delivered", tone: "neutral", date: "Jun 30" },
  { name: "Launch playbook", type: "Documentation", status: "Delivered", tone: "neutral", date: "May 18" },
] as const;

const documents = [
  { name: "Master Service Agreement", status: "Signed", tone: "neutral", date: "Mar 2" },
  { name: "Phase 2 Statement of Work", status: "Signed", tone: "neutral", date: "Jun 14" },
  { name: "Wholesale Portal Proposal", status: "Pending signature", tone: "accent", date: "Jul 30" },
] as const;

const invoices = [
  { id: "INV-0032", amount: "$4,200", status: "Paid", date: "Jul 1" },
  { id: "INV-0031", amount: "$4,200", status: "Paid", date: "Jun 1" },
  { id: "INV-0030", amount: "$4,200", status: "Paid", date: "May 1" },
] as const;

const messages = [
  { from: "Priya · Aster Studio", body: "The wholesale portal wireframes are ready for your review — see Deliverables.", time: "2d ago" },
  { from: "Priya · Aster Studio", body: "Kicking off Phase 2 this week — inventory sync for the wholesale portal.", time: "1w ago" },
  { from: "You", body: "Storefront looks great — customers have already mentioned the checkout.", time: "3w ago" },
] as const;

export function PortalConcept() {
  const [tab, setTab] = React.useState<TabId>("overview");

  return (
    <div className="mx-auto max-w-container px-6 pb-24 pt-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-800 font-mono text-[13px] font-medium text-accent-100">
            FC
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">Fulô Crochet</p>
            <p className="text-xs text-muted-foreground">Aster Client Workspace</p>
          </div>
        </div>
        <span className="rounded-full border border-border px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground">
          Concept preview — seeded with example data
        </span>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[210px_1fr]">
        <aside className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-r-sm border-l-2 px-3.5 py-2.5 text-left text-sm transition-colors ${
                  active
                    ? "border-accent bg-accent/[0.12] text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </aside>

        <main className="max-w-[640px]">
          {tab === "overview" ? (
            <div>
              <SectionTitle>Welcome back, Fulô.</SectionTitle>
              <p className="mb-8 text-[14.5px] text-muted-foreground">Here&apos;s where things stand on your projects.</p>

              <div className="mb-5 rounded-[10px] border border-border bg-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      Active Project
                    </span>
                    <p className="mt-1 text-base font-medium text-foreground">Wholesale Portal — Phase 2</p>
                  </div>
                  <Tag tone="accent">In Progress</Tag>
                </div>
                <div className="my-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                  <div className="h-full w-[62%] rounded-full bg-accent" />
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((step) => {
                    const done = step <= 2;
                    const current = step === 3;
                    return (
                      <React.Fragment key={step}>
                        {step > 1 ? (
                          <span className={`h-px w-4 ${step <= 3 ? "bg-accent" : "bg-border"}`} />
                        ) : null}
                        <span
                          className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full font-mono text-[11px] ${
                            done
                              ? "bg-accent text-background"
                              : current
                                ? "border-[1.5px] border-accent text-accent"
                                : "border-[1.5px] border-border text-muted-foreground"
                          }`}
                        >
                          {done ? "✓" : step}
                        </span>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[10px] border border-border bg-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      Completed
                    </span>
                    <p className="mt-1 text-base font-medium text-foreground">Storefront Launch</p>
                  </div>
                  <Tag>Launched</Tag>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Live since May 18 — storefront, checkout, and inventory sync.
                </p>
              </div>
            </div>
          ) : null}

          {tab === "deliverables" ? (
            <div>
              <SectionTitle>Deliverables</SectionTitle>
              <div className="overflow-x-auto rounded-[10px] border border-border">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-xs uppercase tracking-[0.1em] text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Deliverable</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliverables.map((row) => (
                      <tr key={row.name} className="border-b border-border/60 last:border-0">
                        <td className="px-4 py-3 text-foreground">{row.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.type}</td>
                        <td className="px-4 py-3">
                          <Tag tone={row.tone}>{row.status}</Tag>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {tab === "messages" ? (
            <div>
              <SectionTitle>Messages</SectionTitle>
              <div className="mb-5 flex flex-col gap-px overflow-hidden rounded-[10px] bg-border">
                {messages.map((message, i) => (
                  <div key={i} className="flex justify-between gap-4 bg-card px-[18px] py-4">
                    <div>
                      <p className="mb-1 text-sm font-medium text-foreground">{message.from}</p>
                      <p className="text-[13.5px] text-muted-foreground">{message.body}</p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground/70">
                      {message.time}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2.5">
                <Input placeholder="Write a message…" disabled className="flex-1" />
                <Button type="button" disabled>
                  Send
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}

          {tab === "documents" ? (
            <div>
              <SectionTitle>Documents</SectionTitle>
              <div className="overflow-x-auto rounded-[10px] border border-border">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-xs uppercase tracking-[0.1em] text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Document</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((row) => (
                      <tr key={row.name} className="border-b border-border/60 last:border-0">
                        <td className="px-4 py-3 text-foreground">{row.name}</td>
                        <td className="px-4 py-3">
                          <Tag tone={row.tone}>{row.status}</Tag>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {tab === "billing" ? (
            <div>
              <SectionTitle>Billing</SectionTitle>
              <div className="mb-6 max-w-[340px] rounded-[10px] border border-border bg-card p-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  Current plan
                </span>
                <p className="mt-1 text-base font-medium text-foreground">Growth Partnership</p>
                <p className="mt-2 text-sm text-muted-foreground">Next invoice Aug 15.</p>
              </div>
              <div className="overflow-x-auto rounded-[10px] border border-border">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-xs uppercase tracking-[0.1em] text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Invoice</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((row) => (
                      <tr key={row.id} className="border-b border-border/60 last:border-0">
                        <td className="px-4 py-3 text-foreground">{row.id}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.amount}</td>
                        <td className="px-4 py-3">
                          <Tag>{row.status}</Tag>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {tab === "support" ? (
            <div>
              <SectionTitle>Support</SectionTitle>
              <div className="max-w-[420px] rounded-[10px] border border-border bg-card p-6">
                <p className="text-base font-medium text-foreground">Need something outside the plan?</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Open a request and your team will respond within one business day.
                </p>
                <Button type="button" disabled className="mt-4 w-full">
                  New support request
                </Button>
              </div>
              <p className="mt-5 text-[13.5px] text-muted-foreground">
                Or reach your team directly — priya@aster.studio
              </p>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
