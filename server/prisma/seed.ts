import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { ensureStripeProduct } from '../src/lib/stripeSync.js';

const prisma = new PrismaClient();

const ARCHIVED_PLAN_SLUGS = ['webos', 'launchos', 'commerceos', 'growthos'];

// 2026-10 pricing migration — Starter/Growth/Scale are being repriced and
// a new Business tier is being added. Existing paid Orders snapshot their
// own `amount` at purchase time (see checkout.routes.ts), so they're
// unaffected either way, but the OLD Plan rows stay completely untouched
// (price, features, Stripe price ids) and are just renamed off their
// canonical slug + archived, rather than overwritten in place — so any
// dashboard that joins an existing Order to its Plan keeps showing
// exactly what that customer actually paid. The canonical slugs
// (starter/growth/scale/business) are then free for the new rows below.
// Each entry's `price` is the original (pre-migration) price in cents —
// used only to find the specific unmigrated row; safe to run repeatedly.
const LEGACY_PLAN_MIGRATIONS = [
  { oldSlug: 'starter', oldPrice: 19700, newSlug: 'starter-legacy-2025' },
  { oldSlug: 'growth', oldPrice: 69700, newSlug: 'growth-legacy-2025' },
  { oldSlug: 'scale', oldPrice: 179700, newSlug: 'scale-legacy-2025' },
];

const PLANS = [
  {
    name: 'Starter',
    slug: 'starter',
    description: 'Para pequenos negócios que estão estruturando a presença digital.',
    features: [
      'Site profissional com WebOS',
      'Acesso à Biblioteca de Templates',
      'Personalização de texto, cores e imagens',
      'Publicação com domínio ASTER',
    ],
    price: 9900,
    annualPrice: 100800,
  },
  {
    name: 'Growth',
    slug: 'growth',
    description: 'Para negócios que precisam de reservas, agendamentos e mais geração de clientes.',
    features: [
      'Tudo do Starter',
      'Reservas, agendamentos e pedidos de orçamento',
      'Captação e gestão de clientes (leads)',
      'Avaliações de clientes',
      'Sugestões da Luna AI',
    ],
    price: 19900,
    annualPrice: 202800,
  },
  {
    name: 'Business',
    slug: 'business',
    description: 'Para negócios com catálogo de produtos e operação comercial mais robusta.',
    features: [
      'Tudo do Growth',
      'Catálogo de produtos com CommerceOS',
      'Controle de estoque e pedidos',
      'Painel de análise do negócio',
    ],
    price: 39900,
    annualPrice: 406800,
  },
  {
    name: 'Scale',
    slug: 'scale',
    description: 'Para operações maiores, com necessidades específicas de suporte e integração.',
    features: [
      'Tudo do Business',
      'Suporte prioritário',
      'Onboarding assistido',
      'Condições sob consulta para necessidades maiores',
    ],
    price: 79900,
    annualPrice: 814800,
  },
];

async function main() {
  for (const migration of LEGACY_PLAN_MIGRATIONS) {
    const existing = await prisma.plan.findUnique({ where: { slug: migration.oldSlug } });
    if (existing && existing.price === migration.oldPrice) {
      await prisma.plan.update({
        where: { id: existing.id },
        data: { slug: migration.newSlug, status: 'ARCHIVED' },
      });
      console.log(`  Migrated legacy plan ${existing.name} (${migration.oldSlug} -> ${migration.newSlug}), price/features untouched.`);
    }
  }

  for (const plan of PLANS) {
    const saved = await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });

    const stripeIds = await ensureStripeProduct(saved);
    if (stripeIds) {
      await prisma.plan.update({ where: { id: saved.id }, data: stripeIds });
      console.log(`  Stripe product synced for ${saved.name} (${stripeIds.stripeProductId})`);
    }
  }

  await prisma.plan.updateMany({
    where: { slug: { in: ARCHIVED_PLAN_SLUGS } },
    data: { status: 'ARCHIVED' },
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@asterops.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'change-me-now';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: adminEmail,
      passwordHash,
      name: 'ASTER Admin',
      role: 'ADMIN',
    },
  });

  console.log(`Seeded ${PLANS.length} plans and admin account (${adminEmail}).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
