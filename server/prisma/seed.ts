import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PLANS = [
  {
    name: 'WebOS',
    slug: 'webos',
    description: 'The operating system for businesses that need a premium website and brand presence.',
    features: [
      'Custom-built website on our design system',
      'Copy, SEO and analytics setup',
      'Brand assets and style guide',
      'Launch in 2-3 weeks',
    ],
    price: 199700,
  },
  {
    name: 'LaunchOS',
    slug: 'launchos',
    description: 'The operating system for businesses launching a new product, offer or funnel.',
    features: [
      'Everything in WebOS',
      'Landing pages and lead capture flows',
      'Automation and CRM setup',
      'Paid traffic-ready tracking',
    ],
    price: 349700,
  },
  {
    name: 'CommerceOS',
    slug: 'commerceos',
    description: 'The operating system for businesses that sell online at scale.',
    features: [
      'Everything in LaunchOS',
      'Full storefront build (Shopify-ready)',
      'Catalog, checkout and conversion optimization',
      'Ongoing performance monitoring',
    ],
    price: 599700,
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
