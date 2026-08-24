# Handoff: Aster platform — homepage, diagnostic, and productized system pages

## Overview

This package covers the redesign of the Aster marketing site plus three new product surfaces
proposed for the self-serve platform. It exists to move Aster's positioning from
"technology studio that delivers projects" to "company that sells five operating systems",
and to add the funnel that makes self-serve possible: a diagnostic that recommends a system
and a service tier before anyone talks to a human.

The target codebase is **`Sophiariela/Asterops`** (`main`) — Next.js 15 App Router,
React 19, TypeScript, Tailwind CSS 4, `next-themes`, Framer Motion, Lucide icons,
Notion as the CRM sink. Everything here should land as `.tsx` in that app,
using its existing component and config conventions.

---

## About the design files

**The files in `designs/` are design references created in HTML. They are not production code.**

They are prototypes that show intended look, copy, layout, and behavior. They are authored as
"Design Components" — a single-file HTML format with a small template dialect
(`{{ hole }}`, `<sc-for>`, `<sc-if>`) and a logic class in a `<script>` at the bottom.
That dialect exists only in the design tool. **Do not port it.**

The task is to **recreate these designs in the Asterops codebase** using its established patterns:
React function components under `src/components/`, Tailwind utility classes, content in
`src/config/*.ts`, `cn()` for class composition, `next/image` for imagery, and the
existing `ThemeProvider` for dark/light.

Mapping the dialect to React:

| Design file | React equivalent |
| --- | --- |
| `<sc-for list="{{ items }}" as="item">` | `items.map(item => …)` |
| `<sc-if value="{{ flag }}">` | `{flag && …}` |
| `{{ value }}` in text | `{value}` |
| `style="…"` inline literals | Tailwind utility classes |
| `style-hover="…"` | `hover:` variants |
| logic class `renderVals()` | a typed const in `src/config/*.ts`, or component props |
| `<x-import component-from-global-scope="…">` | a normal React import |

`designs/support.js` and `designs/image-slot.js` are the design tool's runtime. They are
included only so the HTML files open and render locally. **Ignore both when implementing.**

---

## Fidelity

**High fidelity.** Colors, type, spacing, radii, and interaction states are final and are
listed exactly below. Recreate pixel-for-pixel using the codebase's Tailwind theme.

Two caveats:

1. The prototypes were built in a design system called Nocturne with a theme layer
   (`designs/aster-theme.css`) that overrides Nocturne's tokens with the repo's real brand
   values, read out of `src/config/theme.ts` and `src/app/globals.css`. **The repo's own
   Tailwind theme is the source of truth** — where the two disagree, follow the repo.
   The theme layer is included so you can see which token each surface used.
2. `Aster-Client-Portal.dc.html` and `Aster-Diagnostic.dc.html` have no repo counterpart.
   They are new. Everything else maps to existing routes.

---

## The blocking conflict — read this first

The designs assume **five** operating systems. The repo currently ships **three** products, and
`next.config.ts` has permanent (308) redirects pointing all five OS slugs at those three:

```
/solutions/website-os     → /solutions/aster-foundation
/solutions/commerce-os    → /solutions/aster-foundation
/solutions/launch-os      → /solutions/aster-foundation
/solutions/growth-os      → /solutions/aster-intelligence
/solutions/operations-os  → /solutions/aster-automation
```

`Aster-Homepage-Premium.dc.html` (the five-system design) cannot ship until this is decided.
Two coherent options:

- **Adopt five systems.** Expand `src/config/products.ts` to five entries, delete those five
  redirects, add redirects the other way (`/solutions/aster-foundation` → `/solutions/website-os`),
  and update `src/app/sitemap.ts`. Permanent redirects are cached hard by browsers and CDNs, so
  ship the reverse redirects in the same deploy.
- **Keep three products.** Then implement `Aster-Homepage-Repo.dc.html` instead — same visual
  language, three-product content, matching the existing config.

Both designs are in this bundle for exactly that reason. Pick one; don't merge them.

---

## Design tokens

Taken from `src/config/theme.ts` and `src/app/globals.css`, restated here so this README is
self-sufficient. All values are the dark theme, which is the primary.

### Color

| Role | Hex | Use |
| --- | --- | --- |
| Ground | `#0A0A0C` | page background |
| Surface | `#111214` | cards, elevated panels |
| Text | `#F5F6F8` | primary text |
| Divider | `#26272D` | borders, rules |
| Accent | `#4F46E5` | primary action, icon chips, numerals, focus ring |

Neutral ramp: `#F5F6F8` `#E3E4E9` `#C6C8D0` `#9A9CA6` `#74767F` `#565860` `#3C3D44` `#26272C` `#17181B` (100→900).

Accent ramp: `#EFEEFE` `#DEDCFC` `#C2BEF9` `#948DF1` `#4F46E5` `#4038C4` `#322C9B` `#232063` `#16143A` (100→900).

Body copy uses neutral-400 `#9A9CA6`. Muted mono labels use neutral-500 `#74767F`.

**Accent discipline — this is what makes the page read as premium.** The accent appears in
exactly four places: the filled primary button, the 46px icon chips, the process numerals
(at 32% opacity), and the focus ring. It never fills a large area. Adding a fifth accent
surface will cheapen the whole page.

Common composites used throughout, as literal CSS:

```css
color-mix(in srgb, var(--color-accent) 10%, transparent)  /* icon chip fill */
color-mix(in srgb, var(--color-accent) 30%, transparent)  /* icon chip border */
color-mix(in srgb, var(--color-accent) 40%, transparent)  /* card hover border */
color-mix(in srgb, var(--color-accent) 32%, transparent)  /* process numeral */
color-mix(in srgb, var(--color-divider) 60%, transparent) /* section rule */
```

### Type

- Heading + body: **Geist**, weight 500 max. Never bolder — hierarchy is size and space.
- Mono: **Geist Mono**, for eyebrows, numerals, stats, and metadata only.

| Role | Size | Weight | Tracking | Line height |
| --- | --- | --- | --- | --- |
| Hero H1 | `clamp(44px, 7vw, 84px)` | 500 | −0.035em | 1.02 |
| Section H2 | `clamp(32px, 4vw, 48px)` | 500 | −0.03em | 1.1 |
| Card H3 | 20px | 500 | −0.015em | 1.25 |
| Hero sub | `clamp(18px, 2.1vw, 21px)` | 400 | — | 1.6 |
| Section intro | 17px | 400 | — | 1.65 |
| Card body | 14.5px | 400 | — | 1.6 |
| Eyebrow (mono) | 12px | 500 | 0.2em, uppercase | — |
| Stat numeral (mono) | `clamp(30px, 3.4vw, 42px)` | 500 | −0.04em | 1 |
| Process numeral (mono) | 40px | 500 | −0.04em | 1 |
| Capability chip (mono) | 10.5px | 400 | 0.06em, uppercase | — |

Hero H1 is capped at `max-width: 19ch`; hero sub at `60ch`; section intros at `60ch`;
body paragraphs at `64ch`. Headlines use `text-wrap: balance`.

### Spacing, radius, elevation

- Section padding: **128px** vertical, 24px horizontal. Hero: 160px top.
- Content max width: **1280px**, centered.
- Card padding: 32–36px. Grid gap: 20px. Stat/process grid gap: 32–36px.
- Radius: 6px small, **10px** default (cards, buttons, images), 14px for the CTA card.
- Shadows: `--shadow-md: 0 0 0 1px #2A2B31, 0 6px 18px rgba(0,0,0,0.6)` — used only on the
  Aster side of the comparison. On a near-black ground, elevation is an edge plus ambient
  darkness. Do not stack shadows.

---

## Screens

### 1. Homepage — five systems (`Aster-Homepage-Premium.dc.html`) — PRIMARY

**Route:** `/` · **Purpose:** position Aster as five operating systems and route visitors into
the diagnostic.

Section order, top to bottom:

**Header** — 68px, sticky, `z-40`, `border-bottom` in divider/60, background
`color-mix(in srgb, var(--color-bg) 80%, transparent)` with `backdrop-filter: blur(12px)`.
Left: 28px asterisk chip (8px radius, accent/10 fill, accent/30 border) + "Aster" in mono 16px/600.
Center: Systems · Showcase · Process · Contact, 14px/500, neutral-400 → text on hover.
Right: "Client login" ghost link + filled accent "Book a Consultation" (38px tall, 18px padding).

**Hero** — 160px top padding, centered, max-width 960px.
- Eyebrow: "Operating systems for modern business", mono 12px, 0.25em tracking, accent.
- H1: **"Build a smarter business."**
- Sub: "Technology, automation, AI, and digital infrastructure — designed as one system, so growth stops depending on who remembers to do the work."
- Buttons: filled accent **"Find your growth system"** → `/diagnostic` (52px tall, 34px padding, arrow-right icon); outlined **"Explore the systems"** → `#systems`.
- Background (decorative, `aria-hidden`): 64px×64px grid at 15% opacity, masked by
  `radial-gradient(ellipse 58% 52% at 50% 0%, black, transparent)`; a 460px accent/20 blob at
  `left:24% top:-40px` blurred 120px animating `translate(0,0) → translate(44px,32px)` over 18s
  ease-in-out infinite alternate; a 380px accent/10 blob at `right:24% top:70px` doing
  `→ translate(-34px,44px)` over 22s; a 200px bottom fade to ground.
  **Wrap both blob animations in `prefers-reduced-motion`.**

**Stat band** — 120px below hero, above a divider/60 top rule, 4 columns, 128px bottom padding.
Mono numerals over 13.5px neutral-400 labels:
- **One** — Platform underneath all five systems — no duplicated infrastructure.
- **Days** — From configuration to a live system, not quarters.
- **5** — Operating systems, each addressing one part of the business.
- **99.98%** — Uptime target across deployed Aster infrastructure.

**Systems** (`#systems`) — five cards, `repeat(auto-fit, minmax(320px, 1fr))`, 20px gap.
Each card: 10px radius, surface fill, divider border → accent/40 on hover (140ms ease),
`overflow: hidden`, and structured as image + body:
- 3:2 preview image at top, `object-fit: cover`, divider bottom border, neutral-900 fallback fill.
  Source: `public/examples/{website|commerce|launch|growth|operations}-os-1.png` (already in the repo).
- Mono accent name (11px, 0.16em) with an 18px arrow-up-right in neutral-400 on the same row.
- H3 tagline, then 14.5px neutral-400 body.
- Capability chips: mono 10.5px uppercase, 999px radius, divider border, 5px/11px padding.
- Outcome block pinned to the bottom (`margin-top: auto`) above a divider top rule:
  mono 10px uppercase "Outcome" label over 14px text.

| System | Tagline | Capabilities | Outcome |
| --- | --- | --- | --- |
| WebOS | Digital presence infrastructure. | Premium websites · Brand experience · SEO foundation · Lead capture | More credibility. More qualified leads. |
| CommerceOS | Commerce infrastructure for modern brands. | E-commerce platforms · Payment integrations · Catalog management · Customer journeys | More sales. Fewer abandoned carts. |
| LaunchOS | Launch faster. Validate smarter. | MVP development · Startup platforms · Validation systems · Launch-ready builds | From idea to live in weeks, not quarters. |
| GrowthOS | Growth intelligence for scaling businesses. | Analytics dashboards · CRM systems · Customer intelligence · AI-driven insights | Clearer decisions. Faster growth. |
| OperationsOS | Automate the business behind the business. | AI assistants · Workflow automation · Internal portals · Process management | Less manual work. More capacity to scale. |

Card bodies, verbatim:
- WebOS — "Professional websites, digital experiences, lead generation, and the credibility to be taken seriously."
- CommerceOS — "E-commerce, payments, customer journeys, catalog management, and online sales built as one system."
- LaunchOS — "MVPs, startup platforms, validation systems, and launch-ready products that reach real customers."
- GrowthOS — "Analytics, CRM, dashboards, and customer intelligence, so decisions stop being instinct."
- OperationsOS — "AI assistants, workflow automation, and internal systems that absorb the repetitive work."

**Why Aster** — H2 "A website is a page. A system is the business." Two cards side by side.
Left (Traditional agency): divider border, no fill, mono neutral-500 label, X icons in neutral-600,
items in neutral-400 — "Delivers pages, then moves on" · "Priced by the project" ·
"Limited infrastructure underneath" · "Every change is a new engagement".
Right (Aster): accent/40 border, surface fill, `--shadow-md`, mono accent label, accent check icons,
items in full text color — "Delivers systems that keep working" · "Built for long-term growth" ·
"Real business infrastructure" · "Automation built in from day one" · "AI integrated, not bolted on" ·
"Scalable architecture across five systems".

**CommerceOS showcase** (`#showcase`) — full-bleed, 21:9, no horizontal padding.
Image: `public/design-inspirations/fulo-crochet/storefront-desktop.svg`, `object-position: center top`.
This asset is **light** (cream ground), so the scrim is heavy:
```css
linear-gradient(to top,
  var(--color-bg) 26%,
  color-mix(in srgb, var(--color-bg) 88%, transparent) 48%,
  color-mix(in srgb, var(--color-bg) 32%, transparent) 70%,
  transparent 92%),
linear-gradient(to bottom, color-mix(in srgb, var(--color-bg) 55%, transparent), transparent 18%)
```
Overlaid at bottom-left (1280px container, 52px bottom padding): a 28px accent rule + mono
"CommerceOS in production" in **full text color** (accent at 12px fails contrast over the light
asset — the accent lives in the rule instead), then H2 "Built for modern commerce."
at `clamp(30px, 4.4vw, 54px)`.

Below, on ground: "A real-world example of a CommerceOS implementation — not a template, not a
product for sale. Every Aster build is designed for one business." Then four fact columns, each
with a divider top rule, mono accent label, 14.5px neutral-300 body:
- **Client** — Fulô Crochet — a handmade crochet studio scaling past direct messages.
- **System** — CommerceOS: storefront, checkout, inventory and customer accounts.
- **Highlights** — Custom checkout, subscription bundles, and a wholesale portal.
- **Outcome** — Higher average order value and materially lower cart abandonment.

Buttons: filled "View experience" → `https://fulo-crochet-site.onrender.com/`
(`target="_blank" rel="noopener"`, arrow-up-right icon); outlined "Build something similar" → `/contact`.

**Legal/positioning constraint:** Fulô must never be called a template, and templates are
never sold. Keep this copy as written.

**Industries** — H2 "Different industries. Same mission." Six cards,
`repeat(auto-fit, minmax(220px, 1fr))`, 26px padding, accent Lucide icon + 15px/500 label:
Retail · Fashion · Education · Startups · Professional services · Communities.

**Process** (`#process`) — H2 "From discovery to scale." Five columns,
`repeat(auto-fit, minmax(200px, 1fr))`, 36px gap. Each: a row with the mono numeral (40px,
accent/32) and a flex-1 hairline rule beside it, then H3, then 14px neutral-400 body.

The rule must live **inside** the flex row, not absolutely positioned — an absolute connector
overflows the last column at any `auto-fit` breakpoint.

01 Discover — "We analyze the business and find where technology is actually holding it back."
02 Design — "We architect the system — the priorities, the sequence, the shape of it."
03 Build — "We develop the software, automation and AI that make up your infrastructure."
04 Automate — "We connect the workflows so the system runs without manual handoffs."
05 Scale — "We improve continuously, using data to guide what comes next."

**Trust** — H2 "Built to earn trust at scale." Three dashed-border placeholder cards
(Case studies · Testimonials · Project metrics), each with a decorative mono glyph in accent/28
and a mono "Coming soon" label. Below a divider rule: "Trusted by teams building with Aster"
centered, over five mono neutral-600 "Client 0N" placeholders in a 56px-gap row.

Replace these with real logos and metrics before launch — they are honest placeholders,
not filler, and they read as placeholders on purpose.

**Final CTA** — centered card, max-width 880px, 14px radius, surface fill, divider border,
88px vertical padding, `overflow: hidden`, with a decorative 600×400 accent/20 blob blurred
120px at `top:-180px` centered.
H2 "Your business deserves more than a website. It deserves a system." (max 26ch)
Sub "Build the digital infrastructure behind your next stage of growth."
Filled "Find your growth system" → `/diagnostic`; outlined "Talk to Aster" → `/contact`.

**Footer** — divider/60 top rule, 72px top padding. Brand block (asterisk chip + "Aster" +
"Intelligent digital systems for ambitious businesses — the technology infrastructure behind
modern companies.") beside four link columns: Systems (five OS), Company (Find your system,
Showcase, Design system), Contact (Start a project, Client login, contact@asteropsco.com),
Legal (Privacy Policy, Terms of Service). Bottom bar: "© 2026 Aster Studio Ltda. All rights
reserved." and mono "Systems, not websites."

---

### 2. Homepage — three products (`Aster-Homepage-Repo.dc.html`) — ALTERNATIVE

Same visual language, matched to the **current** `src/config/products.ts`. Implement this one
instead if the three-product model stays. Differences from the five-system version:

- Hero is the repo's existing copy: "Transform your business with intelligent digital systems."
  with the three-line sub and "Build my system" / "Explore solutions" buttons.
- No stat band.
- Section order follows the current `src/app/page.tsx`: Hero → Problems We Solve → Solutions →
  Industries → Design Inspirations → Case Studies → How Aster Works → CTA.
- "Problems We Solve": four cards pairing a pain point with its solution, from `src/config/content.ts`.
- Solutions: three cards (Aster Foundation, Aster Automation, Aster Intelligence) with icon chips
  rather than preview images.
- Design Inspirations: three cards. Only Fulô (`status: "live"`) shows a preview image and a
  "View Experience" button; `status: "concept"` cards render an icon mark and only
  "Build Something Similar". Below the grid, the required disclaimer: "These are design
  references, not products. Aster does not sell templates — every project is designed and
  built for one business."
- Case Studies: two cards (Rowing School, Startup) with a mono "Case study in progress" label.
- Process is four steps, not five (no Automate).

---

### 3. Diagnostic (`Aster-Diagnostic.dc.html`) — NEW

**Route:** `/diagnostic` · **Purpose:** recommend one or two systems and a service tier from nine
business questions, so the visitor self-qualifies before any human contact.

Two states in one route: a question flow, then a result.

**Question state.** 2px accent progress bar at the top (`width: step/9 × 100%`, 220ms ease).
Centered column, max-width 680px, 72px top padding. Per question: a 32px accent rule +
mono "Question N of 9 · {theme}", H1 at `clamp(28px, 3.6vw, 40px)`, a 15.5px neutral-400 helper
line, then 3–4 full-width option buttons in a 10px-gap column.

Option button: surface fill → accent/9 when selected; divider border → accent/45 when selected;
10px radius, 18px/20px padding; an 18px radio circle (neutral-700 border → accent when selected,
with a 7px accent inner dot). Clicking an option **advances immediately** — there is no Next
button. Footer row: outlined "Back" (disabled on question 1) and a mono note,
"Business questions only — no technical decisions".

Going back and re-answering must **truncate** all later answers, not just overwrite the current
one — otherwise stale answers keep scoring.

The nine questions, their themes, and their score weights are in the logic class of
`designs/Aster-Diagnostic.dc.html` (the `QUESTIONS` const). Port that table verbatim into
`src/config/diagnostic.ts`. Themes in order: Business · Stage · Constraint · Presence ·
Selling · Customers · Operations · Launch · Existing systems.

**Scoring.** Each option contributes weights to a `{web, commerce, launch, growth, ops}` tally
and may set tier flags (`integrations`, `migration`, `custom`).

Recommendation rules, exactly:
- Rank systems by score. `primary` = highest.
- `second` is included only if its score `>= max(3, primary × 0.6)`.
- Show 1 or 2 systems. Never all five.
- Tier: `custom > 0` → **Aster Studio**; else `migration > 0 || integrations >= 2` → **Aster Pro**;
  else **Self-serve**.

**Result state.** H1 is the system names joined with " + ". Then a two-column layout:
- Left: one card per recommended system — mono accent name, a "Start here" / "Then this" pill,
  tagline, a "why" paragraph keyed to the system, and a fit bar (`score/max × 100%`).
  The primary card gets an accent/45 border and `--shadow-md`; the second gets a plain divider border.
- Right: the tier card (accent/45 border, `--shadow-md`) with the tier name, its rationale, and a
  full-width CTA — Self-serve → the CommerceOS builder, Pro/Studio → `/contact`.
  Below it, a "Not recommended yet" card listing the remaining systems with their relative
  scores and the line "Layer these on once the first system is live. Aster never sells all
  five at once."
- Full-width below: "What you told us" — all nine theme/answer pairs in a two-column grid, each
  with a divider bottom rule — plus a ghost "Start over".

The honesty of this flow is the point. Aster Studio's rationale says custom software is
"beyond what a standard system configures… and saying otherwise would waste your time."
Keep that tone; it is what makes the recommendation credible.

The Self-serve CTA points at `Aster-CommerceOS-Builder`, which is **not built**. Route it to
`/contact` until the builder exists.

---

### 4. Existing pages

Restyled to the same language; each maps to current repo components (see `designs/github.md`
for the file-level map).

- **`Aster-Solution-CommerceOS.dc.html`** → `/solutions/[slug]`. Overview, features, tech stack,
  process, deliverables, integrations, pricing philosophy, consultation CTA.
- **`Aster-Inspiration-Fulo.dc.html`** → `/design-inspirations/fulo-crochet`. Hero, desktop and
  mobile previews, UX highlights, commerce capabilities, business outcomes, "Build Something
  Similar" CTA.
- **`Aster-Contact.dc.html`** → `/contact`. Name, company, industry, goals, timeline, budget range.
  The repo already posts this to Notion via `src/lib/notion.ts` — keep that intact.
- **`Aster-Client-Portal.dc.html`** → new, no counterpart. Concept dashboard: active projects,
  status, deliverables, messages, documents, billing, support.
- **`Aster-Design-System.dc.html`** → reference sheet for the tokens above.
- **`Aster-IA.dc.html`** → sitemap and user flows as diagrams.
- **`AsterNav.dc.html` / `AsterFooter.dc.html`** → the header and footer in isolation.
- **`Aster Platform Proposal.dc.html`** → the written architecture proposal: Aster Core,
  a 14-entity data model, the CommerceOS builder as a resumable draft, the four-phase roadmap,
  and the smallest sellable version. Read this before making architectural decisions.

---

## Interactions & behavior

- **Card hover:** border divider → accent/40, `transition: border-color 140ms ease`. No lift, no
  scale, no shadow change.
- **Link hover:** neutral-400 → text color.
- **Filled button hover:** `color-mix(in srgb, accent 88%, black)`; active: `76%, black`.
- **Focus:** `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }`
  on every interactive element. Never leave the browser default.
- **Hero blobs:** 18s and 22s ease-in-out infinite alternate. Gate on `prefers-reduced-motion`.
- **Diagnostic progress bar:** `width` transition 220ms ease.
- **Anchor nav:** `scroll-behavior: smooth`, and `scroll-margin-top: 68px` on every anchored
  section so the sticky header doesn't cover the heading.
- **Responsive:** every grid is `repeat(auto-fit, minmax(Npx, 1fr))` — no breakpoint logic needed.
  Type scales via `clamp()`. Check the process row and stat band at ~900px, where they reflow
  from 5 and 4 columns to 2.

---

## State management

Only the diagnostic holds state:

```ts
{ step: number, answers: number[] }   // answers[i] = chosen option index for question i
```

- `pick(qIndex, optIndex)` → truncate `answers` to `qIndex`, set the answer, `step = qIndex + 1`.
- `back()` → `step = max(0, step - 1)`.
- `restart()` → reset both.
- `step >= 9` renders the result. Scoring is derived, never stored.

Worth persisting to `sessionStorage` so a refresh doesn't wipe nine answers — the prototype
does not, and it should.

Everything else is static content plus the existing Notion form POST.

---

## Assets

All already in the repo — no new assets needed:

- `public/examples/{website,commerce,launch,growth,operations}-os-1.png` — the five system card
  previews. Dark-ground wireframes; they sit correctly on the near-black page.
- `public/examples/*-os-{2,3}.png` — **ten unused previews**, two per system. Natural material for
  a gallery on each solution page.
- `public/design-inspirations/fulo-crochet/storefront-desktop.svg` — the showcase image.
  Light/cream ground; needs the heavy scrim documented above.

Icons are Lucide (already a dependency). The prototypes hand-rolled inline SVG paths because the
design tool has no icon package — **use Lucide components instead**: `Globe`, `ShoppingCart`,
`Rocket`, `BarChart3`, `Workflow`, `ArrowRight`, `ArrowUpRight`, `Check`, `X`.

---

## Files

In `designs/`:

| File | Screen |
| --- | --- |
| `Aster-Homepage-Premium.dc.html` | Homepage, five systems — **primary** |
| `Aster-Homepage-Repo.dc.html` | Homepage, three products — alternative |
| `Aster-Diagnostic.dc.html` | Diagnostic flow — new |
| `Aster-Solution-CommerceOS.dc.html` | Solution detail |
| `Aster-Inspiration-Fulo.dc.html` | Design inspiration detail |
| `Aster-Contact.dc.html` | Contact / project inquiry |
| `Aster-Client-Portal.dc.html` | Client portal concept — new |
| `Aster-Design-System.dc.html` | Token reference |
| `Aster-IA.dc.html` | Sitemap and flows |
| `AsterNav.dc.html`, `AsterFooter.dc.html` | Header and footer in isolation |
| `Aster Platform Proposal.dc.html` | Architecture proposal — read first |
| `aster-theme.css` | The token layer, showing which token each surface used |
| `github.md` | Screen → repo-file map, and sync history |
| `support.js`, `image-slot.js` | Design tool runtime — **ignore** |

Open any `.dc.html` in a browser to see it render.

In `screenshots/` — reference captures of every screen, with a `README.md` indexing them.
The diagnostic's result frame is a real run of the scoring rules and documents the answer set
that produced it, which makes a ready test case for the ported engine.

---

## Suggested order

1. Read `Aster Platform Proposal.dc.html`.
2. Decide three vs five products; handle the `next.config.ts` redirects in the same deploy.
3. Extend the Tailwind theme if any token above is missing.
4. Build the chosen homepage — sections in order, `src/config/` for content.
5. Build `/diagnostic`, porting the `QUESTIONS` table and the ranking rules verbatim.
6. Restyle the existing solution, inspiration, and contact pages.
7. Leave the client portal last — it is a concept, not a committed feature.
