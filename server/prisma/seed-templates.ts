import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SectionSpec = { type: string; heading: string; bodyPattern: string };
type PageSpec = {
  slug: string;
  name: string;
  purpose: string;
  heroHeadlinePattern: string;
  heroSubheadlinePattern: string;
  ctaLabel: string;
  hasLeadForm: boolean;
  sections: SectionSpec[];
};
type TemplateSpec = {
  key: string;
  name: string;
  industry: string;
  primaryGoal: string;
  complexity: 'SIMPLE' | 'STANDARD' | 'ADVANCED';
  description: string;
  recommendedUseCase: string;
  isEcommerce?: boolean;
  pages: PageSpec[];
};

function page(spec: Omit<PageSpec, 'sections'> & { sections?: SectionSpec[] }): PageSpec {
  return { ...spec, sections: spec.sections ?? [] };
}

// Every page gets real, page-specific SEO copy derived from its own name
// and purpose — not a shared generic string — so "SEO structure" is part
// of the template itself, not left for the customer to fill in later.
function seoTitlePattern() {
  return '{{pageName}} — {{businessName}}';
}
function seoDescriptionPattern() {
  return '{{purpose}} — {{businessName}} serves {{targetAudience}} in {{industry}}.';
}

const TEMPLATES: TemplateSpec[] = [
  {
    key: 'FITNESS',
    name: 'Fitness Coaching',
    industry: 'Fitness & wellness',
    primaryGoal: 'Lead generation',
    complexity: 'STANDARD',
    description: 'A results-driven site built to convert trial signups for gyms, studios and personal trainers.',
    recommendedUseCase: 'Best for gyms, personal trainers and fitness studios selling memberships or coaching programs.',
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert first-time visitors into a trial',
        heroHeadlinePattern: '{{businessName}} — transform with {{industry}} training',
        heroSubheadlinePattern: 'Programs built for {{targetAudience}}: {{services}}.',
        ctaLabel: 'Start your free trial', hasLeadForm: true,
        sections: [
          { type: 'benefits', heading: 'Why members stay', bodyPattern: '' },
          { type: 'transformations', heading: 'Real transformations', bodyPattern: "Members of {{businessName}} have used {{services}} to hit goals they'd stalled on for years — real progress, not before/after gimmicks." },
          { type: 'trust-placeholder', heading: 'What members say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'programs', name: 'Programs', purpose: 'Help visitors find the right program',
        heroHeadlinePattern: 'Find your program', heroSubheadlinePattern: '{{services}}, matched to {{targetAudience}}.',
        ctaLabel: 'Start your free trial', hasLeadForm: true,
        sections: [{ type: 'program-overview', heading: 'Programs we offer', bodyPattern: '' }],
      }),
      page({
        slug: 'trainers', name: 'Trainers', purpose: 'Build trust in the coaching team',
        heroHeadlinePattern: 'Meet the team', heroSubheadlinePattern: 'Certified coaches for {{targetAudience}}.',
        ctaLabel: 'Start your free trial', hasLeadForm: false,
        sections: [{ type: 'expertise', heading: 'Why our coaching works', bodyPattern: 'Every coach at {{businessName}} is certified and trained specifically in {{services}} — not generic programming.' }],
      }),
      page({
        slug: 'results', name: 'Results', purpose: 'Prove the program works with real outcomes',
        heroHeadlinePattern: 'Real results from real members', heroSubheadlinePattern: 'What {{targetAudience}} have achieved with {{businessName}}.',
        ctaLabel: 'Start your free trial', hasLeadForm: false,
        sections: [
          { type: 'transformations', heading: 'Transformations', bodyPattern: 'Progress members of {{businessName}} have made working on {{services}}.' },
          { type: 'trust-placeholder', heading: 'What members say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'pricing', name: 'Pricing', purpose: 'Remove pricing objections',
        heroHeadlinePattern: 'Membership plans', heroSubheadlinePattern: 'Simple pricing for {{services}}.',
        ctaLabel: 'Start your free trial', hasLeadForm: false,
        sections: [{ type: 'program-overview', heading: 'Plans', bodyPattern: '' }],
      }),
      page({
        slug: 'contact', name: 'Contact', purpose: 'Capture a direct inquiry',
        heroHeadlinePattern: 'Questions before you start?', heroSubheadlinePattern: "We'll help you pick the right program.",
        ctaLabel: 'Ask us', hasLeadForm: true,
      }),
    ],
  },
  {
    key: 'ECOMMERCE',
    name: 'Ecommerce Storefront',
    industry: 'Ecommerce & retail',
    primaryGoal: 'Sales',
    complexity: 'STANDARD',
    description: 'A conversion-focused storefront built around product discovery and checkout.',
    recommendedUseCase: 'Best for direct-to-consumer brands selling physical or digital products online.',
    isEcommerce: true,
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert first-time visitors into shoppers',
        heroHeadlinePattern: '{{businessName}} — {{industry}} for {{targetAudience}}', heroSubheadlinePattern: 'Shop {{services}} with fast, reliable delivery.',
        ctaLabel: 'Shop now', hasLeadForm: true,
        sections: [
          { type: 'featured-products', heading: 'Featured products', bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What customers say', bodyPattern: '' },
          { type: 'benefits', heading: 'Why shop with us', bodyPattern: 'Free shipping over a threshold, easy returns, and real support — {{businessName}} makes buying {{services}} simple.' },
        ],
      }),
      page({
        slug: 'collections', name: 'Collections', purpose: 'Help shoppers browse by category',
        heroHeadlinePattern: 'Browse the collection', heroSubheadlinePattern: '{{services}}.',
        ctaLabel: 'Shop now', hasLeadForm: false,
        sections: [{ type: 'featured-products', heading: 'Shop by collection', bodyPattern: '' }],
      }),
      page({
        slug: 'product', name: 'Product', purpose: 'Convert product-page visitors into buyers',
        heroHeadlinePattern: 'Product details', heroSubheadlinePattern: 'Everything you need to know before you buy.',
        ctaLabel: 'Add to cart', hasLeadForm: false,
        sections: [
          { type: 'benefits', heading: 'Product benefits', bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'Reviews', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'cart', name: 'Cart', purpose: 'Recover carts before checkout drop-off',
        heroHeadlinePattern: 'Your cart', heroSubheadlinePattern: 'Review your order before checkout.',
        ctaLabel: 'Checkout', hasLeadForm: false,
        sections: [{ type: 'offers', heading: 'Complete the look', bodyPattern: "Shoppers who buy {{services}} from {{businessName}} often add one more item — a real opportunity to increase order value here." }],
      }),
      page({
        slug: 'checkout', name: 'Checkout', purpose: 'Complete the sale with minimal friction',
        heroHeadlinePattern: 'Checkout', heroSubheadlinePattern: 'Secure payment, fast confirmation.',
        ctaLabel: 'Place order', hasLeadForm: false,
      }),
      page({
        slug: 'faq', name: 'FAQ', purpose: 'Answer objections that block a purchase',
        heroHeadlinePattern: 'Frequently asked questions', heroSubheadlinePattern: 'Shipping, returns and support for {{targetAudience}}.',
        ctaLabel: 'Contact support', hasLeadForm: true,
      }),
    ],
  },
  {
    key: 'SAAS',
    name: 'SaaS Product',
    industry: 'SaaS & software',
    primaryGoal: 'Trials',
    complexity: 'STANDARD',
    description: 'A product-led site focused on trial signups and feature clarity.',
    recommendedUseCase: 'Best for B2B or B2C software products selling via self-serve free trials.',
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert visitors into trial signups',
        heroHeadlinePattern: '{{businessName}}: {{industry}} software built for {{targetAudience}}', heroSubheadlinePattern: 'Ship faster with {{services}}.',
        ctaLabel: 'Start free trial', hasLeadForm: true,
        sections: [
          { type: 'benefits', heading: 'Why teams switch', bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What teams say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'features', name: 'Features', purpose: 'Explain product capabilities',
        heroHeadlinePattern: 'Everything {{targetAudience}} need', heroSubheadlinePattern: 'Built around {{services}}.',
        ctaLabel: 'Start free trial', hasLeadForm: false,
        sections: [{ type: 'benefits', heading: 'Feature highlights', bodyPattern: '' }],
      }),
      page({
        slug: 'pricing', name: 'Pricing', purpose: 'Remove pricing objections',
        heroHeadlinePattern: 'Simple, transparent pricing', heroSubheadlinePattern: 'No hidden fees, cancel anytime.',
        ctaLabel: 'Start free trial', hasLeadForm: false,
      }),
      page({
        slug: 'integrations', name: 'Integrations', purpose: "Show it fits the visitor's existing stack",
        heroHeadlinePattern: 'Works with your stack', heroSubheadlinePattern: '{{businessName}} connects to the tools {{targetAudience}} already use.',
        ctaLabel: 'Start free trial', hasLeadForm: false,
        sections: [{ type: 'benefits', heading: 'Popular integrations', bodyPattern: '' }],
      }),
      page({
        slug: 'documentation', name: 'Documentation', purpose: 'Support technical evaluation',
        heroHeadlinePattern: 'Documentation', heroSubheadlinePattern: 'Everything a developer needs to get {{businessName}} running.',
        ctaLabel: 'Start free trial', hasLeadForm: false,
      }),
      page({
        slug: 'contact', name: 'Contact', purpose: 'Convert high-value accounts via sales',
        heroHeadlinePattern: 'Talk to sales', heroSubheadlinePattern: 'For teams evaluating {{businessName}} at scale.',
        ctaLabel: 'Book a call', hasLeadForm: true,
      }),
    ],
  },
  {
    key: 'CONSULTANT',
    name: 'Consultant Authority Site',
    industry: 'Consulting',
    primaryGoal: 'Appointments',
    complexity: 'STANDARD',
    description: 'An authority-building site that converts inquiries into booked consultations.',
    recommendedUseCase: 'Best for independent consultants and boutique advisory practices selling engagements.',
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Establish authority and convert to a booked call',
        heroHeadlinePattern: '{{businessName}} — {{industry}} consulting for {{targetAudience}}', heroSubheadlinePattern: 'Practical help with {{services}}.',
        ctaLabel: 'Book a consultation', hasLeadForm: true,
        sections: [
          { type: 'expertise', heading: 'How we help', bodyPattern: '{{businessName}} brings hands-on {{industry}} experience to {{targetAudience}} — direct implementation of {{services}}, not theory.' },
          { type: 'trust-placeholder', heading: 'What clients say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'services', name: 'Services', purpose: 'Detail engagement offerings',
        heroHeadlinePattern: 'Engagements we offer', heroSubheadlinePattern: '{{services}}.',
        ctaLabel: 'Book a consultation', hasLeadForm: true,
        sections: [{ type: 'expertise', heading: "What's included", bodyPattern: 'Each engagement is scoped around {{services}}, tailored to {{targetAudience}}.' }],
      }),
      page({
        slug: 'case-studies', name: 'Case Studies', purpose: 'Prove results with evidence',
        heroHeadlinePattern: 'Results for {{targetAudience}}', heroSubheadlinePattern: 'Real outcomes from real engagements.',
        ctaLabel: 'Book a consultation', hasLeadForm: false,
        sections: [
          { type: 'results', heading: 'Results', bodyPattern: 'Clients working with {{businessName}} on {{services}} see measurable change — real case studies appear here once added.' },
          { type: 'trust-placeholder', heading: 'What clients say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'about', name: 'About', purpose: 'Build trust and credibility',
        heroHeadlinePattern: 'Why {{targetAudience}} choose {{businessName}}', heroSubheadlinePattern: 'Our story and approach.',
        ctaLabel: 'Book a consultation', hasLeadForm: false,
        sections: [{ type: 'expertise', heading: 'Background & approach', bodyPattern: '{{businessName}} has focused specifically on {{industry}} for {{targetAudience}} — deep, not broad.' }],
      }),
      page({
        slug: 'book-a-call', name: 'Book a Call', purpose: 'Convert intent into a scheduled call',
        heroHeadlinePattern: 'Book a call', heroSubheadlinePattern: 'Pick a time that works — no back-and-forth.',
        ctaLabel: 'Schedule now', hasLeadForm: true,
      }),
    ],
  },
  {
    key: 'AGENCY',
    name: 'Creative Agency',
    industry: 'Creative & marketing agencies',
    primaryGoal: 'Lead generation',
    complexity: 'STANDARD',
    description: 'A portfolio-first site that turns visitors into project inquiries.',
    recommendedUseCase: 'Best for design, marketing, dev or creative agencies pitching project-based work.',
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert visitors into project inquiries',
        heroHeadlinePattern: '{{businessName}} — {{industry}} agency for {{targetAudience}}', heroSubheadlinePattern: 'We deliver {{services}}.',
        ctaLabel: 'Start a project', hasLeadForm: true,
        sections: [
          { type: 'benefits', heading: 'What we do', bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What clients say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'services', name: 'Services', purpose: 'Explain how engagements work',
        heroHeadlinePattern: 'How we work', heroSubheadlinePattern: '{{services}}.',
        ctaLabel: 'Start a project', hasLeadForm: false,
        sections: [{ type: 'benefits', heading: 'Our process', bodyPattern: '' }],
      }),
      page({
        slug: 'portfolio', name: 'Portfolio', purpose: 'Showcase past work as proof',
        heroHeadlinePattern: 'Selected work', heroSubheadlinePattern: 'Projects for {{targetAudience}}.',
        ctaLabel: 'Start a project', hasLeadForm: false,
        sections: [{ type: 'results', heading: 'Featured projects', bodyPattern: 'A sample of {{services}} work {{businessName}} has delivered for clients like {{targetAudience}}.' }],
      }),
      page({
        slug: 'process', name: 'Process', purpose: 'Set expectations for how an engagement runs',
        heroHeadlinePattern: 'Our process', heroSubheadlinePattern: 'From kickoff to delivery.',
        ctaLabel: 'Start a project', hasLeadForm: false,
        sections: [{ type: 'benefits', heading: 'How an engagement runs', bodyPattern: '' }],
      }),
      page({
        slug: 'about', name: 'About', purpose: 'Build trust in the team',
        heroHeadlinePattern: 'About {{businessName}}', heroSubheadlinePattern: 'Who we are and how we think.',
        ctaLabel: 'Start a project', hasLeadForm: false,
        sections: [{ type: 'trust-placeholder', heading: 'What clients say', bodyPattern: '' }],
      }),
      page({
        slug: 'contact', name: 'Contact', purpose: 'Capture project briefs',
        heroHeadlinePattern: 'Tell us about your project', heroSubheadlinePattern: "We'll follow up within a day.",
        ctaLabel: 'Send brief', hasLeadForm: true,
      }),
    ],
  },
  {
    key: 'RESTAURANT',
    name: 'Restaurant & Reservations',
    industry: 'Restaurants & hospitality',
    primaryGoal: 'Reservations',
    complexity: 'SIMPLE',
    description: 'A menu-and-reservations site built to fill tables.',
    recommendedUseCase: 'Best for restaurants, cafes and bars taking reservations or walk-ins.',
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert visitors into a reservation',
        heroHeadlinePattern: '{{businessName}} — {{industry}}', heroSubheadlinePattern: 'Serving {{targetAudience}} with {{services}}.',
        ctaLabel: 'Reserve a table', hasLeadForm: true,
        sections: [
          { type: 'benefits', heading: 'Why guests love us', bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What guests say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'menu', name: 'Menu', purpose: 'Showcase what you serve',
        heroHeadlinePattern: 'Our menu', heroSubheadlinePattern: '{{services}}.',
        ctaLabel: 'Reserve a table', hasLeadForm: false,
        sections: [{ type: 'menu-highlights', heading: 'On the menu', bodyPattern: '' }],
      }),
      page({
        slug: 'reservations', name: 'Reservations', purpose: 'Convert intent into a booking',
        heroHeadlinePattern: 'Book your table', heroSubheadlinePattern: 'Walk-ins welcome, reservations recommended.',
        ctaLabel: 'Reserve now', hasLeadForm: true,
      }),
      page({
        slug: 'contact', name: 'Contact', purpose: 'Help guests find and reach you',
        heroHeadlinePattern: 'Find us', heroSubheadlinePattern: 'Hours, location and private events.',
        ctaLabel: 'Contact us', hasLeadForm: true,
      }),
    ],
  },
  {
    key: 'CREATOR',
    name: 'Creator Community',
    industry: 'Content creators',
    primaryGoal: 'Audience growth',
    complexity: 'SIMPLE',
    description: 'A community-first site for a creator turning an audience into a business.',
    recommendedUseCase: 'Best for content creators, coaches and educators monetizing an audience directly.',
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert visitors into community members',
        heroHeadlinePattern: '{{businessName}} — {{industry}} for {{targetAudience}}', heroSubheadlinePattern: 'Explore {{services}}.',
        ctaLabel: 'Join the community', hasLeadForm: true,
        sections: [
          { type: 'benefits', heading: 'What you get', bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What members say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'content', name: 'Content', purpose: 'Showcase recent work or posts',
        heroHeadlinePattern: 'Latest content', heroSubheadlinePattern: '{{services}}.',
        ctaLabel: 'Join the community', hasLeadForm: false,
      }),
      page({
        slug: 'offers', name: 'Offers', purpose: 'Present ways to work together',
        heroHeadlinePattern: 'Work with {{businessName}}', heroSubheadlinePattern: '{{services}}.',
        ctaLabel: 'See offers', hasLeadForm: true,
        sections: [{ type: 'benefits', heading: 'Ways to work together', bodyPattern: '' }],
      }),
      page({
        slug: 'contact', name: 'Contact', purpose: 'Capture direct inquiries',
        heroHeadlinePattern: "Let's connect", heroSubheadlinePattern: 'Questions, collabs, or press.',
        ctaLabel: 'Send message', hasLeadForm: true,
      }),
    ],
  },
  {
    key: 'LOCAL_BUSINESS',
    name: 'Local Business',
    industry: 'Local & home services',
    primaryGoal: 'Calls and inquiries',
    complexity: 'STANDARD',
    description: 'A trust-first site for a business that serves a local area in person.',
    recommendedUseCase: 'Best for home services, local shops and in-person service businesses.',
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert first-time visitors into a quote request',
        heroHeadlinePattern: '{{businessName}} — trusted {{industry}} serving {{targetAudience}}', heroSubheadlinePattern: 'Local, reliable, and ready to help with {{services}}.',
        ctaLabel: 'Get a free quote', hasLeadForm: true,
        sections: [
          { type: 'benefits', heading: 'Why locals choose us', bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What customers say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'services', name: 'Services', purpose: 'Explain what you offer',
        heroHeadlinePattern: 'What we offer', heroSubheadlinePattern: '{{services}}, done right.',
        ctaLabel: 'Request service', hasLeadForm: true,
        sections: [{ type: 'benefits', heading: 'Our services', bodyPattern: '' }],
      }),
      page({
        slug: 'reviews', name: 'Reviews', purpose: 'Build trust with direct customer proof',
        heroHeadlinePattern: 'What customers say', heroSubheadlinePattern: 'Real feedback from {{targetAudience}}.',
        ctaLabel: 'Get a free quote', hasLeadForm: false,
        sections: [{ type: 'trust-placeholder', heading: 'Reviews', bodyPattern: '' }],
      }),
      page({
        slug: 'gallery', name: 'Gallery', purpose: 'Showcase past work',
        heroHeadlinePattern: 'Our work', heroSubheadlinePattern: 'A look at recent jobs for {{targetAudience}}.',
        ctaLabel: 'Get a free quote', hasLeadForm: false,
        sections: [{ type: 'results', heading: 'Recent work', bodyPattern: 'Examples of {{services}} completed for {{targetAudience}} — real jobs, once added here.' }],
      }),
      page({
        slug: 'contact', name: 'Contact', purpose: 'Capture a direct inquiry',
        heroHeadlinePattern: 'Get in touch', heroSubheadlinePattern: "We'll respond within one business day.",
        ctaLabel: 'Send message', hasLeadForm: true,
      }),
    ],
  },
  {
    key: 'PERSONAL_BRAND',
    name: 'Personal Brand',
    industry: 'Personal branding',
    primaryGoal: 'Audience growth',
    complexity: 'STANDARD',
    description: 'A newsletter-first site built to grow a personal audience.',
    recommendedUseCase: 'Best for writers, speakers, coaches and public figures building a following around themselves.',
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert visitors into subscribers',
        heroHeadlinePattern: '{{businessName}} — {{industry}} for {{targetAudience}}', heroSubheadlinePattern: 'Ideas and work on {{services}}.',
        ctaLabel: 'Subscribe', hasLeadForm: true,
        sections: [
          { type: 'benefits', heading: "What you'll find here", bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What readers say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'about', name: 'About', purpose: 'Build trust and credibility',
        heroHeadlinePattern: 'About {{businessName}}', heroSubheadlinePattern: 'My background and how I think about {{industry}}.',
        ctaLabel: 'Subscribe', hasLeadForm: false,
        sections: [{ type: 'expertise', heading: 'My story', bodyPattern: '{{businessName}} has spent time deep in {{industry}}, focused on {{services}} for {{targetAudience}}.' }],
      }),
      page({
        slug: 'content', name: 'Content', purpose: 'Showcase recent work or posts',
        heroHeadlinePattern: 'Writing & talks', heroSubheadlinePattern: '{{services}}.',
        ctaLabel: 'Subscribe', hasLeadForm: false,
      }),
      page({
        slug: 'newsletter', name: 'Newsletter', purpose: 'Convert intent into a subscriber',
        heroHeadlinePattern: 'Join the newsletter', heroSubheadlinePattern: 'No spam — just {{services}}, occasionally.',
        ctaLabel: 'Subscribe now', hasLeadForm: true,
      }),
      page({
        slug: 'contact', name: 'Contact', purpose: 'Capture direct inquiries',
        heroHeadlinePattern: 'Get in touch', heroSubheadlinePattern: 'Speaking, collabs or press.',
        ctaLabel: 'Send message', hasLeadForm: true,
      }),
    ],
  },
  {
    key: 'PROFESSIONAL_SERVICES',
    name: 'Professional Services Firm',
    industry: 'Professional services (legal, financial, accounting)',
    primaryGoal: 'Appointments',
    complexity: 'STANDARD',
    description: 'A credibility-first site built to convert inquiries into scheduled consultations.',
    recommendedUseCase: 'Best for law firms, accounting practices and financial advisors selling trust-based services.',
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert visitors into a scheduled consultation',
        heroHeadlinePattern: '{{businessName}} — {{industry}} for {{targetAudience}}', heroSubheadlinePattern: 'Trusted help with {{services}}.',
        ctaLabel: 'Schedule a consultation', hasLeadForm: true,
        sections: [
          { type: 'benefits', heading: 'Why clients choose us', bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What clients say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'services', name: 'Services', purpose: 'Explain what you offer',
        heroHeadlinePattern: 'Our services', heroSubheadlinePattern: '{{services}}.',
        ctaLabel: 'Schedule a consultation', hasLeadForm: true,
        sections: [{ type: 'benefits', heading: 'Areas we handle', bodyPattern: '' }],
      }),
      page({
        slug: 'expertise', name: 'Expertise', purpose: 'Build trust in credentials and experience',
        heroHeadlinePattern: 'Credentials & experience', heroSubheadlinePattern: 'Licensed, experienced, and focused on {{targetAudience}}.',
        ctaLabel: 'Schedule a consultation', hasLeadForm: false,
        sections: [{ type: 'expertise', heading: 'Our credentials', bodyPattern: '{{businessName}} brings direct experience in {{services}} for {{targetAudience}}.' }],
      }),
      page({
        slug: 'case-studies', name: 'Case Studies', purpose: 'Prove results with evidence',
        heroHeadlinePattern: 'Client outcomes', heroSubheadlinePattern: 'Real results for {{targetAudience}}.',
        ctaLabel: 'Schedule a consultation', hasLeadForm: false,
        sections: [
          { type: 'results', heading: 'Outcomes', bodyPattern: 'Clients working with {{businessName}} on {{services}} resolve real, specific problems — case studies added here build that proof.' },
          { type: 'trust-placeholder', heading: 'What clients say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'contact', name: 'Contact', purpose: 'Capture a direct inquiry',
        heroHeadlinePattern: 'Get in touch', heroSubheadlinePattern: 'Tell us about your situation.',
        ctaLabel: 'Send inquiry', hasLeadForm: true,
      }),
    ],
  },
];

async function main() {
  let created = 0;
  let skipped = 0;

  for (const spec of TEMPLATES) {
    const existing = await prisma.template.findFirst({ where: { key: spec.key as never } });
    if (existing) {
      skipped += 1;
      console.log(`  Skipped ${spec.name} (${spec.key}) — a template with this key already exists.`);
      continue;
    }

    const template = await prisma.template.create({
      data: {
        key: spec.key as never,
        name: spec.name,
        industry: spec.industry,
        primaryGoal: spec.primaryGoal,
        complexity: spec.complexity,
        description: spec.description,
        recommendedUseCase: spec.recommendedUseCase,
        isEcommerce: spec.isEcommerce ?? false,
        status: 'PUBLISHED',
        version: 1,
        pages: {
          create: spec.pages.map((p, i) => ({
            slug: p.slug,
            name: p.name,
            order: i,
            purpose: p.purpose,
            heroHeadlinePattern: p.heroHeadlinePattern,
            heroSubheadlinePattern: p.heroSubheadlinePattern,
            ctaLabel: p.ctaLabel,
            hasLeadForm: p.hasLeadForm,
            seoTitlePattern: seoTitlePattern(),
            seoDescriptionPattern: seoDescriptionPattern(),
            sections: {
              create: p.sections.map((s, j) => ({ type: s.type, heading: s.heading, bodyPattern: s.bodyPattern, order: j })),
            },
          })),
        },
      },
    });
    created += 1;
    console.log(`  Created and published ${template.name} (${template.key}) with ${spec.pages.length} pages.`);
  }

  console.log(`Template Library seed complete: ${created} created, ${skipped} skipped.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
