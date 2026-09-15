import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ARCHIVED_PLAN_SLUGS = ['webos', 'launchos', 'commerceos', 'growthos'];

const PLANS = [
  {
    name: 'Starter',
    slug: 'starter',
    description: 'Para quem está começando a estruturar a operação digital.',
    features: [
      'Até 3 usuários',
      '1 sistema ASTER incluso (WebOS)',
      'Até 1.000 visitas/mês',
      'Suporte por chat',
      'Integrações essenciais (analytics, e-mail)',
    ],
    price: 19700,
    annualPrice: 196800,
  },
  {
    name: 'Growth',
    slug: 'growth',
    description: 'Para quem já vende e precisa escalar com automação.',
    features: [
      'Até 10 usuários',
      '2 sistemas ASTER inclusos (LaunchOS + CommerceOS)',
      'Até 10.000 visitas/mês',
      'Suporte prioritário',
      'Integrações ilimitadas + API',
    ],
    price: 69700,
    annualPrice: 697200,
  },
  {
    name: 'Scale',
    slug: 'scale',
    description: 'Para operações de alto volume e múltiplos canais.',
    features: [
      'Usuários ilimitados',
      'Todos os sistemas ASTER inclusos (WebOS, LaunchOS, CommerceOS, GrowthOS)',
      'Visitas ilimitadas',
      'Agentes de IA inclusos',
      'Gerente de conta dedicado',
    ],
    price: 179700,
    annualPrice: 1796400,
  },
];

async function main() {
  for (const plan of PLANS) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
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
