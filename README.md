# Aster

Aster builds intelligent digital systems that help businesses attract customers, automate
operations, and scale — the technology infrastructure behind modern companies, not just a
website.

## What Aster is today

This repository is the Aster marketing site and lead-capture funnel — not yet the product
platform the copy describes. It's honest to be precise about that: there is no auth, no
per-account data model, and no billing here yet. What exists today is a config-driven Next.js
site, a rules-based diagnostic that qualifies a visitor into a system + service tier, and a
Notion-backed contact flow. The "five systems" are currently five marketing pages sharing one
content model — see [Roadmap](#roadmap) for what turns each one into a real product surface.

## Systems

| System | Route | What it is |
| --- | --- | --- |
| WebOS | `/product/website-os` | Premium websites, brand experience, SEO foundation, lead capture. |
| CommerceOS | `/product/commerce-os` | E-commerce, payments, catalog, customer journeys. |
| LaunchOS | `/product/launch-os` | MVPs and startup platforms — idea to live product. |
| GrowthOS | `/product/growth-os` | Analytics, CRM, dashboards, customer intelligence. |
| OperationsOS | `/product/operations-os` | AI assistants, workflow automation, internal portals. |

Defined in [`src/config/products.ts`](src/config/products.ts). `/diagnostic` recommends one or
two of these plus a service tier (Self-serve / Aster Pro / Aster Studio) from nine business
questions — see [`src/config/diagnostic.ts`](src/config/diagnostic.ts) and
[`src/lib/diagnostic.ts`](src/lib/diagnostic.ts) for the scoring rules.

## Tech stack

- **Framework** — Next.js 15 (App Router, React 19, TypeScript)
- **Styling** — Tailwind CSS + `tailwindcss-animate`, tokens in `src/app/globals.css`,
  mirrored in `src/config/theme.ts` and `tailwind.config.ts`
- **UI primitives** — Radix UI, `class-variance-authority`, `lucide-react` icons
- **Motion** — Framer Motion (`src/components/shared/reveal.tsx`)
- **Forms & validation** — Zod, submitted to a Notion database via `@notionhq/client`
- **Theming** — `next-themes` (dark is primary; see `src/components/shared/theme-toggle.tsx`)
- **Tests** — Vitest (`src/**/*.test.ts`)

## Local development

```bash
npm install
cp .env.example .env.local   # fill in NOTION_API_KEY / NOTION_DATABASE_ID — see docs/notion-crm-setup.md
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build       # production build
npm run start        # serve the production build
npm run lint          # eslint
npm test               # vitest run (unit tests, e.g. the diagnostic scoring engine)
npm run test:watch      # vitest in watch mode
```

CI (`.github/workflows/ci.yml`) runs typecheck, lint, tests and build on every push/PR to `main`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NOTION_API_KEY` | Server-side Notion integration secret used by `/api/contact` to write new leads. |
| `NOTION_DATABASE_ID` | Target Notion database for contact form submissions. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used for metadata, sitemap and JSON-LD (`src/config/site.ts`). Defaults to `https://aster.studio`. |

Full Notion setup walkthrough: [`docs/notion-crm-setup.md`](docs/notion-crm-setup.md).

## Project structure

Routes live under `src/app`, following Next's file-based routing directly — see that folder
for the current route tree rather than a tree copied here, which goes stale the moment a route
changes. The rest:

- **`src/components/`** — `sections/` (homepage blocks), `product/` (product-page building
  blocks), `diagnostic/` (the two-state diagnostic UI), `portal/` (client portal concept),
  `case-study/`, `inspiration/`, `layout/` (header, footer, nav), `shared/` (cross-page
  primitives), `ui/` (design-system primitives).
- **`src/config/`** — content and data, the source of truth for copy and structured content.
  Pages render from typed arrays here, not hardcoded markup — adding a product, case study, or
  design inspiration is a data entry, not a new page.
- **`src/types/`** — shared TypeScript types for the content model above.
- **`src/lib/`** — `seo.ts` (metadata + JSON-LD builders), `notion.ts`, `diagnostic.ts`
  (scoring engine, covered by tests), `utils.ts`.

## Content model

- **Products** (`src/config/products.ts`) — each entry drives `/product/[slug]` via
  `getProductBySlug` / `getProductSlugs`, and (for the five current systems) the homepage
  systems grid via its `homeCard` field.
- **Case studies** (`src/config/case-studies.ts`) — currently empty; the rendering pipeline
  (hero, challenge, solution, deliverables, gallery, technology, results, CTA) is built and
  waiting for the first entry. Add a `CaseStudy` object (`src/types/case-study.ts`) with gallery
  assets under `public/case-studies/<slug>/` to publish one.
- **Design Inspirations** (`src/config/inspirations.ts`) — visual references, explicitly not
  products or templates. Not currently linked from the homepage (the CommerceOS/Fulô showcase
  replaced that section); the data and the `/contact?inspiration=<slug>` deep-link still work,
  pending a dedicated `/design-inspirations/[slug]` detail route.

**Aster does not sell templates.** Design Inspirations and the CommerceOS showcase both exist
to demonstrate craft, not to sell what's shown — keep that framing intact when editing copy.

## Notes

- Legacy bundled-product slugs redirect to their current homes (`next.config.ts`):
  `/product/aster-foundation` → `/products`, `/product/aster-automation` →
  `/product/operations-os`, `/product/aster-intelligence` → `/product/growth-os`.
  `/case-studies/fulo` → `/#showcase`.
- `/portal` is an explicitly-labeled concept preview (static example data, no auth) — not a
  committed feature yet.
- `/design-system` is a public token reference sheet, generated from the same values as
  `src/config/theme.ts` / `tailwind.config.ts`.
- `commerceos-theme/` at the repo root is an unrelated, standalone Shopify Liquid theme — see
  its own README for why it lives here and how it relates (or doesn't) to `src/`.
- Case studies for projects that aren't ready to be shown publicly should keep
  `isPublicLink: false` and must not link out to the live project.

## Roadmap

**Now** — marketing site + diagnostic funnel, five systems positioned, lead capture via Notion.

**Next** — durable persistence for diagnostic completions (today: `sessionStorage` only, so a
non-converting completion is invisible); populate real case studies or retire the unused
rendering pipeline; expand CI coverage as real business logic grows.

**Later** — real auth and a per-account data model once the client portal or a self-serve
builder (e.g. the CommerceOS configurator the diagnostic's Self-serve tier currently points at
`/contact` in place of) becomes a committed feature — that's the trigger for introducing
system-specific product code (`src/systems/<system>/`, `dashboard/`, `crm/`), not before.

**Not yet started** — AI/LLM integration. It's referenced throughout the product copy
(GrowthOS, OperationsOS) but doesn't exist in this codebase yet; treat any "AI-powered" claim
in marketing copy as roadmap, not shipped capability, until this changes.
