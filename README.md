# ASTER

Marketing site + Phase 1 software business platform: authentication, plans, checkout, onboarding, customer dashboard, and admin panel.

## Structure

- `/` — Vite + React + TypeScript frontend (marketing homepage is untouched; app routes live under `src/pages`)
- `/server` — Express + Prisma (PostgreSQL) API

## Frontend routes

| Route | Access | Purpose |
|---|---|---|
| `/` | public | Marketing homepage |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | public | Authentication |
| `/plans` | public | Plan selection (WebOS / LaunchOS / CommerceOS) |
| `/checkout` | customer | Checkout flow (Stripe-ready, simulated in dev) |
| `/onboarding` | customer | Deployment intake form |
| `/dashboard` | customer | Plan, deployment status, submitted info, activity |
| `/admin` | admin | Customers, payments, onboarding forms, deployment status |

## Setup

### 1. Backend

```bash
cd server
cp .env.example .env      # then set DATABASE_URL to a real PostgreSQL instance
npm install
npm run prisma:migrate    # creates tables
npm run prisma:seed       # seeds plans + an admin account (SEED_ADMIN_EMAIL/PASSWORD)
npm run dev                # http://localhost:4000
```

Without `STRIPE_SECRET_KEY` set, checkout falls back to a "simulate payment" step so the full flow (plan → checkout → onboarding → dashboard) works without real Stripe keys. Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to switch to real Stripe Checkout Sessions + webhooks.

### 2. Frontend

```bash
cp .env.example .env      # VITE_API_URL, defaults to http://localhost:4000/api
npm install
npm run dev                # http://localhost:5173
```

## Database

PostgreSQL via Prisma (`server/prisma/schema.prisma`): `User`, `Plan`, `Order`, `Payment`, `OnboardingSubmission`, `DeploymentStatus`, `PasswordResetToken`.
