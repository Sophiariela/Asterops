import type { DiagnosticQuestion, DiagnosticTier, SystemKey } from "@/types";

/** Maps a diagnostic system key to its product slug in `src/config/products.ts`. */
export const SYSTEM_TO_SLUG: Record<SystemKey, string> = {
  web: "website-os",
  commerce: "commerce-os",
  launch: "launch-os",
  growth: "growth-os",
  ops: "operations-os",
};

/**
 * Ported verbatim from `designs/Aster-Diagnostic.dc.html`'s `QUESTIONS` const —
 * do not reweight without re-deriving the screenshots/README's worked example.
 */
export const QUESTIONS: DiagnosticQuestion[] = [
  {
    theme: "Business",
    title: "What does your business do?",
    help: "This sets the baseline — everything after it refines the fit.",
    options: [
      { label: "Sell physical products", scores: { commerce: 3, web: 1 } },
      { label: "Sell digital products or subscriptions", scores: { commerce: 2, growth: 1, web: 1 } },
      { label: "Provide services", scores: { web: 2, ops: 1 } },
      { label: "Teach or run a community", scores: { web: 2, ops: 1, growth: 1 } },
    ],
  },
  {
    theme: "Stage",
    title: "How long has it been running?",
    help: "Stage changes what is worth building first.",
    options: [
      { label: "Not launched yet", scores: { launch: 3, web: 1 } },
      { label: "Under two years", scores: { web: 2, commerce: 1 } },
      { label: "Two to five years", scores: { growth: 1, ops: 1, commerce: 1 } },
      { label: "More than five years", scores: { ops: 2, growth: 2 } },
    ],
  },
  {
    theme: "Constraint",
    title: "What is holding growth back right now?",
    help: "The single biggest one. This carries the most weight.",
    options: [
      { label: "Not enough people find us", scores: { web: 3, growth: 1 } },
      { label: "People find us but do not buy", scores: { commerce: 3, web: 1 } },
      { label: "We cannot keep up with the work", scores: { ops: 3 } },
      { label: "We do not know what is working", scores: { growth: 3 } },
    ],
  },
  {
    theme: "Presence",
    title: "Where do customers find you today?",
    help: "Be honest — a neglected site is a common answer.",
    options: [
      { label: "We have no real website", scores: { web: 3 } },
      { label: "An old site nobody updates", scores: { web: 2 } },
      { label: "Mostly social media", scores: { web: 2, growth: 1 } },
      { label: "A site that works well", scores: { growth: 1, ops: 1 } },
    ],
  },
  {
    theme: "Selling",
    title: "Do you sell online, and how?",
    help: "Including anything informal — DMs and spreadsheets count.",
    options: [
      { label: "Not online at all yet", scores: { commerce: 3 } },
      { label: "Through messages or DMs", scores: { commerce: 3, ops: 1 } },
      { label: "On a marketplace we do not control", scores: { commerce: 2, web: 1 } },
      { label: "Our own working store", scores: { growth: 2 } },
    ],
  },
  {
    theme: "Customers",
    title: "How do you manage customer information?",
    help: "Where does a new enquiry actually go?",
    options: [
      { label: "In our heads and message threads", scores: { ops: 2, growth: 2 } },
      { label: "Spreadsheets", scores: { growth: 2, ops: 1 } },
      { label: "A CRM we barely use", scores: { growth: 2 } },
      { label: "A CRM the team relies on", scores: { growth: 1 }, integrations: 1 },
    ],
  },
  {
    theme: "Operations",
    title: "What still runs on manual work?",
    help: "The tasks someone has to remember to do.",
    options: [
      { label: "Almost everything", scores: { ops: 3 } },
      { label: "Follow-up and admin", scores: { ops: 2 } },
      { label: "Reporting, mostly", scores: { growth: 2, ops: 1 } },
      { label: "Very little", scores: {} },
    ],
  },
  {
    theme: "Launch",
    title: "Are you launching something new?",
    help: "A product, a brand, a new line of business.",
    options: [
      { label: "Yes, and nothing exists yet", scores: { launch: 3 } },
      { label: "Yes, alongside the current business", scores: { launch: 2, web: 1 } },
      { label: "Thinking about it", scores: { launch: 1 } },
      { label: "No, improving what we have", scores: { growth: 1, ops: 1 } },
    ],
  },
  {
    theme: "Existing systems",
    title: "Is there anything that must connect to this?",
    help: "Existing tools, data to move, systems you cannot switch off.",
    options: [
      { label: "Nothing — a clean start", scores: {} },
      { label: "One or two tools", scores: {}, integrations: 1 },
      { label: "Several, plus data to migrate", scores: {}, integrations: 2, migration: 1 },
      { label: "Complex internal software", scores: {}, integrations: 2, custom: 1 },
    ],
  },
];

/** Why each system fits, keyed by the tally key that ranked it. */
export const WHY_TEXT: Record<SystemKey, string> = {
  web: "Your customers cannot find or trust you yet. Presence is the constraint, so it is the first thing to fix.",
  commerce: "You are losing sales in the gap between interest and checkout. Commerce infrastructure closes it.",
  launch: "There is nothing live to improve yet. The priority is getting a real product in front of real customers.",
  growth: "The business runs, but decisions are guesses. Visibility is what unlocks the next stage.",
  ops: "Manual work is the ceiling. Automation raises it without adding headcount.",
};

export const TIER_COPY: Record<DiagnosticTier, { why: string; cta: string }> = {
  "Self-serve": {
    why: "Nothing you described needs custom work. Configure the system yourself and launch — Aster only steps in if you ask.",
    cta: "Configure",
  },
  "Aster Pro": {
    why: "You have data to move or tools that must connect. Standard configuration gets you most of the way; Aster handles the rest with you.",
    cta: "Book a scoped session",
  },
  "Aster Studio": {
    why: "Complex internal software is beyond what a standard system configures. This needs a bespoke engagement — and saying otherwise would waste your time.",
    cta: "Talk to the studio",
  },
};
