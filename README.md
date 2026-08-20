# Aster

Aster builds intelligent digital systems that help businesses attract customers, automate operations, and scale — the technology infrastructure behind modern companies, not just a website.

This repository is the Aster marketing site: a Next.js 15 (App Router) application covering the product pages (Foundation / Automation / Intelligence), the Design Inspirations section, the case study library, and the lead-capture contact flow.

## Tech stack

- **Framework** — Next.js 15 (App Router, React 19, TypeScript)
- **Styling** — Tailwind CSS + `tailwindcss-animate`, tokens defined in `src/app/globals.css` and mirrored in `src/config/theme.ts`
- **UI primitives** — Radix UI (accordion, dialog, navigation menu, tabs, etc.), `class-variance-authority`, `lucide-react` icons
- **Motion** — Framer Motion (`src/components/shared/reveal.tsx`)
- **Forms & validation** — Zod, submitted to a Notion database via `@notionhq/client`
- **Theming** — `next-themes` (light/dark, see `src/components/shared/theme-toggle.tsx`)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in NOTION_API_KEY / NOTION_DATABASE_ID — see docs/notion-crm-setup.md
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NOTION_API_KEY` | Server-side Notion integration secret used by `/api/contact` to write new leads. |
| `NOTION_DATABASE_ID` | Target Notion database for contact form submissions. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used for metadata, sitemap and JSON-LD (`src/config/site.ts`). Defaults to `https://aster.studio`. |

Full Notion setup walkthrough: [`docs/notion-crm-setup.md`](docs/notion-crm-setup.md).

## Project structure

```
src/
  app/                    Routes (App Router)
    page.tsx              Homepage
    products/              Solutions index
    product/[slug]/        Individual product page (Foundation / Automation / Intelligence)
    case-studies/[slug]/   Individual case study page
    about/, contact/, legal/
    api/contact/            Notion lead-capture endpoint
    sitemap.ts, robots.ts, opengraph-image.tsx

  components/
    sections/               Homepage sections (hero, problems, industries, design inspirations, case studies, ...)
    product/                 Product page building blocks (hero, features, pricing, FAQ, gallery, ...)
    inspiration/               Design Inspirations card (visual reference + "Build Something Similar")
    case-study/               Case study page building blocks (hero, challenge, solution,
                               deliverables, gallery, technology, results, CTA)
    layout/                   Header, footer, mobile nav
    shared/                   Cross-page primitives (reveal/animation, lightbox, section heading, ...)
    ui/                       Design-system primitives (button, badge, card, tabs, accordion, ...)

  config/                   Content & data — the source of truth for copy and structured content
    site.ts                  Global site metadata (name, url, description, keywords)
    theme.ts                  Canonical design tokens (mirrors globals.css, used for OG image generation)
    navigation.ts              Header/footer links
    content.ts                  Homepage / about / contact copy
    products.ts                  The three Aster products (Foundation, Automation, Intelligence)
    inspirations.ts                Design Inspirations library (visual references, not products)
    case-studies.ts               Case study library (currently empty)
    contact.ts, socials.ts

  types/                    Shared TypeScript types for the content model above
  lib/                      seo.ts (metadata + JSON-LD builders), notion.ts, utils.ts
```

## Content model

Pages are rendered from typed data in `src/config/`, not hardcoded per-page — adding a new product or case study means adding an entry to the config array, not writing new page markup.

- **Products** (`src/config/products.ts`) — each entry drives `/product/[slug]` via `getProductBySlug` / `getProductSlugs`.
- **Case studies** (`src/config/case-studies.ts`) — each entry drives `/case-studies/[slug]` via `getCaseStudyBySlug` / `getCaseStudySlugs`. To add one, add a `CaseStudy` object (see `src/types/case-study.ts`) with its own gallery assets under `public/case-studies/<slug>/`, then link it from `homeContent.caseStudies.items` in `src/config/content.ts` if it should appear on the homepage.

Both route trees follow the same pattern: `generateStaticParams` from the config's slug list, `generateMetadata` via `buildMetadata()` in `src/lib/seo.ts`, and a per-slug `opengraph-image.tsx`.

## Design Inspirations

**Aster does not sell templates.** Design Inspirations is a homepage section (`src/components/sections/design-inspirations.tsx`, mounted on `/`) that shows visual references — past design directions and craft quality — to demonstrate the standard Aster builds to. It is explicitly not a catalog of products: there is no pricing, no "buy" action, and no dedicated per-item page.

**Adding a reference is a config entry.** Add a `DesignInspiration` object to `designInspirations` in `src/config/inspirations.ts` (type: `src/types/inspiration.ts`) and the card renders automatically — no new routes or components needed.

Required fields: `slug`, `name`, `category`, `description`, `status`, `icon`.

- `status: "live"` — set `image` (a representative visual, under `public/design-inspirations/<slug>/`) and `demoUrl` (a real, browsable experience). The card renders both a **View Experience** button (opens `demoUrl` in a new tab) and a **Build Something Similar** button.
- `status: "concept"` — omit `image`/`demoUrl`. The card renders the `icon` as a placeholder mark and only the **Build Something Similar** button, since there's no live reference to view yet.

Every card's **Build Something Similar** button routes through `inspirationContactHref(slug)` → `/contact?inspiration=<slug>`, which pre-frames the contact form's message with that reference — it never changes what's being sold, only the opening context of the conversation.

The section always renders `designInspirationsContent.disclaimer` under the grid, stating plainly that these are references, not products. Keep that line intact when editing copy — it's the explicit counter to any "template marketplace" reading of the section.

## Notes

- The Fulô Crochet build is presented as a Design Inspirations reference (`fulo-crochet` in `src/config/inspirations.ts`), not a template, product, or a standalone case study page. `/case-studies/fulo` permanently redirects to `/#design-inspirations` (`next.config.ts`).
- Case studies for projects that aren't ready to be shown publicly should keep `isPublicLink: false` and must not link out to the live project.
- Legacy product slugs (`website-os`, `commerce-os`, `launch-os`, `growth-os`, `operations-os`) redirect to their current equivalents in `next.config.ts`.
