# Aster

Aster is a digital automation and software implementation studio. We build and configure the digital infrastructure a business runs on — website, online booking, WhatsApp workflows, customer management, online sales and custom software. We sell implemented outcomes, not templates and not a self-serve platform.

The public site is **pt-BR** and speaks to the beauty & aesthetics niche (salons, nail studios, lash/brow artists, estheticians, spas). That focus lives in copy and seed data, not in the architecture: opening another vertical later means new `Service`/`SolutionTier`/`FaqEntry` rows and a copy pass in `src/config/content.ts` — not a rebuild.

This repository is the Aster site and its internal admin panel: a Next.js 15 (App Router) application covering the public pages (`/`, `/solucoes`, `/como-funciona`, `/projetos`, `/sobre`, `/contato`), the project-inquiry flow, and an authenticated admin panel for managing inquiries, services, solution tiers, FAQ, portfolio projects and site settings.

### Honesty rules baked into the content

These are product decisions, not style preferences — keep them when editing copy:

- **No invented pricing.** `SolutionTier.priceLabel` is free text; while no figure is approved it reads "Solicite uma proposta personalizada." The implementation fee is a separate label.
- **No invented delivery times.** The site never promises "seven days" — the FAQ and the implementation section say the timeline comes out of the diagnosis.
- **No fake integrations.** WhatsApp button/link is standard; automated flows are labelled *sob escopo* because they depend on the official WhatsApp Business API, a verified account and approved templates. Pix is presented the same way, tied to the payment provider chosen per project.
- **No fake proof.** No testimonials, client logos, revenue figures or conversion statistics. Credibility comes from real projects that can be opened — screenshots in `public/projects/` are our own captures of the live sites.

## Tech stack

- **Framework** — Next.js 15 (App Router, React 19, TypeScript)
- **Database** — PostgreSQL (Neon) via Prisma — see `prisma/schema.prisma`
- **Auth** — Minimal cookie-based admin session (HMAC-signed via Web Crypto, enforced in `src/middleware.ts`), passwords hashed with `bcryptjs`
- **Styling** — Tailwind CSS + `tailwindcss-animate`, tokens defined in `src/app/globals.css` and mirrored in `src/config/theme.ts`
- **UI primitives** — Radix UI (accordion, dialog, navigation menu, tabs, etc.), `class-variance-authority`, `lucide-react` icons
- **Motion** — Framer Motion (`src/components/shared/reveal.tsx`)
- **Forms & validation** — Zod. Contact submissions persist to Postgres (`Inquiry` model) and optionally mirror to Notion (`src/lib/notion.ts`) if `NOTION_API_KEY`/`NOTION_DATABASE_ID` are set.
- **Theming** — `next-themes` (light/dark, see `src/components/shared/theme-toggle.tsx`)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, DIRECT_URL, ADMIN_SESSION_SECRET, ADMIN_SEED_EMAIL/PASSWORD
npm run db:push              # create tables in the database
npm run db:seed              # seed services, portfolio projects, site settings, and the first admin user
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build       # prisma generate + production build
npm run start        # serve the production build
npm run lint          # eslint
npm run db:push        # sync prisma/schema.prisma to the database (no migration history)
npm run db:seed         # re-run prisma/seed.ts
npm run db:studio        # open Prisma Studio against the configured database
```

Admin panel: `/admin` (redirects to `/admin/login` if not authenticated). Sign in with `ADMIN_SEED_EMAIL`/`ADMIN_SEED_PASSWORD` after seeding, then change the password by re-seeding with a new `ADMIN_SEED_PASSWORD` (there is currently no in-app "change password" form).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Pooled Postgres connection string used at runtime. |
| `DIRECT_URL` | Direct (non-pooled) Postgres connection string, used by Prisma for schema migrations. |
| `ADMIN_SESSION_SECRET` | Long random string used to sign admin session cookies. |
| `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` | Only read by `npm run db:seed` to create/update the first admin login. |
| `NOTION_API_KEY` / `NOTION_DATABASE_ID` | Optional — if set, each inquiry is also mirrored into a Notion database (best-effort, never blocks a submission). |
| `RESEND_API_KEY` / `INQUIRY_FROM_EMAIL` / `INQUIRY_NOTIFY_EMAIL` | Optional — all three must be set for new-inquiry email notifications (`src/lib/email.ts`). Unset means no email is attempted; the inquiry still persists. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used for metadata, sitemap and JSON-LD (`src/config/site.ts`). Defaults to `https://aster.studio`. |

## Project structure

```
prisma/
  schema.prisma           Service, SolutionTier, FaqEntry, PortfolioProject, Inquiry, InquiryNote, SiteSettings, AdminUser
  seed.ts                  Seeds solutions, tiers, FAQ, portfolio projects, site settings and the first admin user

src/
  app/
    (site)/                 Public site — layout adds the public Header/Footer
      page.tsx               Homepage
      services/               Full services list
      portfolio/[slug]/        Portfolio list + detail
      about/, contact/, legal/
    admin/
      login/                 Standalone login page (no admin shell)
      (protected)/             Dashboard, services/portfolio/inquiries/settings CRUD — behind src/middleware.ts
    api/
      contact/                 Public inquiry submission (persists to Postgres, optional Notion mirror)
      admin/                   Services/portfolio/inquiries/settings CRUD + login/logout — behind src/middleware.ts
    sitemap.ts, robots.ts, opengraph-image.tsx

  components/
    sections/                 Homepage sections (hero, services preview, portfolio preview, cta)
    services/, portfolio/      Public service/portfolio cards
    admin/                     Admin forms, nav, delete button, status select, notes
    contact/                    Project inquiry form
    layout/                     Header, footer, mobile nav
    shared/                     Cross-page primitives (reveal/animation, section heading, theme toggle, ...)
    ui/                         Design-system primitives (button, badge, card, tabs, accordion, ...)

  config/                    Static copy — content that isn't admin-editable
    site.ts, theme.ts, navigation.ts, content.ts

  lib/
    prisma.ts                 Prisma client singleton
    auth.ts, session.ts         Admin auth: bcrypt password hashing + edge-safe signed session cookie
    settings.ts                 Cached SiteSettings reader
    service-icons.tsx            Lucide icon registry for admin-selectable service icons
    seo.ts, notion.ts, utils.ts

  middleware.ts              Protects /admin/* and /api/admin/* (except /admin/login, /api/admin/login)
```

## Content model

Services and portfolio projects are **database-backed and admin-editable** — not static config. The public `/services` and `/portfolio` pages, the homepage previews, and the contact form's service dropdown all read live from Postgres via Prisma. Managing them is done through `/admin`, not by editing files.

Static marketing copy that isn't part of day-to-day content ops (hero headlines, about page copy) lives in `src/config/content.ts`.

## Admin panel

- **Dashboard** (`/admin`) — total/new inquiries, in-progress projects, published portfolio count, recent inquiries.
- **Services** (`/admin/services`) — create/edit/delete, publish toggle, display order, icon picker.
- **Portfolio** (`/admin/portfolio`) — create/edit/delete, publish toggle, classification (client project / internal product / prototype), status, cover image + gallery (by URL), technologies, display order.
- **Inquiries** (`/admin/inquiries`) — filter by status/service, search by name/email, per-inquiry status updates and internal notes, delete.
- **Settings** (`/admin/settings`) — studio name, contact email, WhatsApp, Instagram, main CTA, footer note. Changes reflect immediately on the public site (footer, contact page, JSON-LD).

Cover/gallery images are entered as URLs rather than uploaded as files — there's no file-storage integration (e.g. Vercel Blob) wired up yet. If that's needed, it should be added deliberately rather than assumed.
