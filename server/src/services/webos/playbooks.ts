export type PlaybookKey =
  | 'LOCAL_BUSINESS'
  | 'SAAS'
  | 'ECOMMERCE'
  | 'CONSULTANT'
  | 'AGENCY'
  | 'RESTAURANT'
  | 'FITNESS'
  | 'CREATOR';

export type GeneratorInput = {
  businessName: string;
  industry: string;
  services: string[];
  targetAudience: string;
};

export type PageTemplate = {
  slug: string;
  name: string;
  heroHeadline: string;
  heroSubheadline: string;
  ctaLabel: string;
  hasLeadForm: boolean;
  sections: { type: string; heading: string; body: string }[];
};

export type Playbook = {
  key: PlaybookKey;
  label: string;
  description: string;
  pages: (input: GeneratorInput) => PageTemplate[];
};

function fill(template: string, input: GeneratorInput): string {
  const serviceList = input.services.length ? input.services.join(', ') : 'what we do best';
  return template
    .replace(/\{\{businessName\}\}/g, input.businessName)
    .replace(/\{\{industry\}\}/g, input.industry)
    .replace(/\{\{targetAudience\}\}/g, input.targetAudience)
    .replace(/\{\{services\}\}/g, serviceList);
}

function benefitsSection(input: GeneratorInput, heading: string): PageTemplate['sections'][number] {
  const items = input.services.length ? input.services : ['Quality', 'Reliability', 'Results'];
  return {
    type: 'benefits',
    heading,
    body: items.map((s) => `• ${s}`).join('\n'),
  };
}

function trustPlaceholderSection(): PageTemplate['sections'][number] {
  return {
    type: 'trust-placeholder',
    heading: 'What customers say',
    body: 'No testimonials added yet — the Trust Engine will flag this until at least 3 are added.',
  };
}

function applyFillToPages(pages: (input: GeneratorInput) => PageTemplate[]) {
  return (input: GeneratorInput): PageTemplate[] =>
    pages(input).map((p) => ({
      ...p,
      heroHeadline: fill(p.heroHeadline, input),
      heroSubheadline: fill(p.heroSubheadline, input),
      sections: p.sections.map((s) => ({ ...s, heading: fill(s.heading, input), body: fill(s.body, input) })),
    }));
}

export const PLAYBOOKS: Record<PlaybookKey, Playbook> = {
  CREATOR: {
    key: 'CREATOR',
    label: 'Creator',
    description: 'A community-first site for a creator turning an audience into a business.',
    pages: applyFillToPages((input) => [
      { slug: 'home', name: 'Home', heroHeadline: '{{businessName}} — {{industry}} for {{targetAudience}}', heroSubheadline: 'Explore {{services}}.', ctaLabel: 'Join the community', hasLeadForm: true, sections: [benefitsSection(input, 'What you get'), trustPlaceholderSection()] },
      { slug: 'content', name: 'Content', heroHeadline: 'Latest content', heroSubheadline: '{{services}}.', ctaLabel: 'Join the community', hasLeadForm: false, sections: [] },
      { slug: 'offers', name: 'Offers', heroHeadline: 'Work with {{businessName}}', heroSubheadline: '{{services}}.', ctaLabel: 'See offers', hasLeadForm: true, sections: [benefitsSection(input, 'Ways to work together')] },
      { slug: 'contact', name: 'Contact', heroHeadline: "Let's connect", heroSubheadline: 'Questions, collabs, or press.', ctaLabel: 'Send message', hasLeadForm: true, sections: [] },
    ]),
  },
  LOCAL_BUSINESS: {
    key: 'LOCAL_BUSINESS',
    label: 'Local business',
    description: 'A trust-first site for a business that serves a local area in person.',
    pages: applyFillToPages((input) => [
      {
        slug: 'home', name: 'Home',
        heroHeadline: '{{businessName}} — trusted {{industry}} serving {{targetAudience}}',
        heroSubheadline: 'Local, reliable, and ready to help with {{services}}.',
        ctaLabel: 'Get a free quote', hasLeadForm: true,
        sections: [benefitsSection(input, 'Why locals choose us'), trustPlaceholderSection()],
      },
      { slug: 'services', name: 'Services', heroHeadline: 'What we offer', heroSubheadline: '{{services}}, done right.', ctaLabel: 'Request service', hasLeadForm: true, sections: [benefitsSection(input, 'Our services')] },
      { slug: 'about', name: 'About', heroHeadline: 'Why {{targetAudience}} choose {{businessName}}', heroSubheadline: 'Our story and what we stand for.', ctaLabel: 'Get a free quote', hasLeadForm: false, sections: [trustPlaceholderSection()] },
      { slug: 'contact', name: 'Contact', heroHeadline: 'Get in touch', heroSubheadline: "We'll respond within one business day.", ctaLabel: 'Send message', hasLeadForm: true, sections: [] },
    ]),
  },
  SAAS: {
    key: 'SAAS',
    label: 'SaaS',
    description: 'A product-led site focused on trial signups and feature clarity.',
    pages: applyFillToPages((input) => [
      { slug: 'home', name: 'Home', heroHeadline: '{{businessName}}: {{industry}} software built for {{targetAudience}}', heroSubheadline: 'Ship faster with {{services}}.', ctaLabel: 'Start free trial', hasLeadForm: true, sections: [benefitsSection(input, 'Why teams switch'), trustPlaceholderSection()] },
      { slug: 'features', name: 'Features', heroHeadline: 'Everything {{targetAudience}} need', heroSubheadline: 'Built around {{services}}.', ctaLabel: 'Start free trial', hasLeadForm: false, sections: [benefitsSection(input, 'Feature highlights')] },
      { slug: 'pricing', name: 'Pricing', heroHeadline: 'Simple, transparent pricing', heroSubheadline: 'No hidden fees, cancel anytime.', ctaLabel: 'Start free trial', hasLeadForm: false, sections: [] },
      { slug: 'contact', name: 'Contact', heroHeadline: 'Talk to sales', heroSubheadline: 'For teams evaluating {{businessName}} at scale.', ctaLabel: 'Book a call', hasLeadForm: true, sections: [] },
    ]),
  },
  ECOMMERCE: {
    key: 'ECOMMERCE',
    label: 'Ecommerce',
    description: 'A conversion-focused storefront site.',
    pages: applyFillToPages((input) => [
      { slug: 'home', name: 'Home', heroHeadline: '{{businessName}} — {{industry}} for {{targetAudience}}', heroSubheadline: 'Shop {{services}} with fast, reliable delivery.', ctaLabel: 'Shop now', hasLeadForm: false, sections: [benefitsSection(input, 'Why shop with us'), trustPlaceholderSection()] },
      { slug: 'shop', name: 'Shop', heroHeadline: 'Browse the collection', heroSubheadline: '{{services}}.', ctaLabel: 'Shop now', hasLeadForm: false, sections: [] },
      { slug: 'about', name: 'About', heroHeadline: 'Our story', heroSubheadline: 'What makes {{businessName}} different.', ctaLabel: 'Shop now', hasLeadForm: false, sections: [] },
      { slug: 'contact', name: 'Contact', heroHeadline: 'Need help with an order?', heroSubheadline: "We're here for {{targetAudience}}.", ctaLabel: 'Contact support', hasLeadForm: true, sections: [] },
    ]),
  },
  CONSULTANT: {
    key: 'CONSULTANT',
    label: 'Consultant',
    description: 'An authority-building site that converts inquiries into consultations.',
    pages: applyFillToPages((input) => [
      { slug: 'home', name: 'Home', heroHeadline: '{{businessName}} — {{industry}} consulting for {{targetAudience}}', heroSubheadline: 'Practical help with {{services}}.', ctaLabel: 'Book a consultation', hasLeadForm: true, sections: [benefitsSection(input, 'How we help'), trustPlaceholderSection()] },
      { slug: 'services', name: 'Services', heroHeadline: 'Engagements we offer', heroSubheadline: '{{services}}.', ctaLabel: 'Book a consultation', hasLeadForm: true, sections: [benefitsSection(input, 'What is included')] },
      { slug: 'case-studies', name: 'Case Studies', heroHeadline: 'Results for {{targetAudience}}', heroSubheadline: 'Real outcomes from real engagements.', ctaLabel: 'Book a consultation', hasLeadForm: false, sections: [trustPlaceholderSection()] },
      { slug: 'contact', name: 'Contact', heroHeadline: "Let's talk", heroSubheadline: 'Tell us about your goals.', ctaLabel: 'Send inquiry', hasLeadForm: true, sections: [] },
    ]),
  },
  AGENCY: {
    key: 'AGENCY',
    label: 'Agency',
    description: 'A portfolio-first site that turns visitors into project inquiries.',
    pages: applyFillToPages((input) => [
      { slug: 'home', name: 'Home', heroHeadline: '{{businessName}} — {{industry}} agency for {{targetAudience}}', heroSubheadline: 'We deliver {{services}}.', ctaLabel: 'Start a project', hasLeadForm: true, sections: [benefitsSection(input, 'What we do'), trustPlaceholderSection()] },
      { slug: 'work', name: 'Work', heroHeadline: 'Selected work', heroSubheadline: 'Projects for {{targetAudience}}.', ctaLabel: 'Start a project', hasLeadForm: false, sections: [] },
      { slug: 'services', name: 'Services', heroHeadline: 'How we work', heroSubheadline: '{{services}}.', ctaLabel: 'Start a project', hasLeadForm: false, sections: [benefitsSection(input, 'Our process')] },
      { slug: 'contact', name: 'Contact', heroHeadline: "Tell us about your project", heroSubheadline: "We'll follow up within a day.", ctaLabel: 'Send brief', hasLeadForm: true, sections: [] },
    ]),
  },
  RESTAURANT: {
    key: 'RESTAURANT',
    label: 'Restaurant',
    description: 'A menu-and-reservations site built to fill tables.',
    pages: applyFillToPages((input) => [
      { slug: 'home', name: 'Home', heroHeadline: '{{businessName}} — {{industry}}', heroSubheadline: 'Serving {{targetAudience}} with {{services}}.', ctaLabel: 'Reserve a table', hasLeadForm: true, sections: [benefitsSection(input, 'Why guests love us'), trustPlaceholderSection()] },
      { slug: 'menu', name: 'Menu', heroHeadline: 'Our menu', heroSubheadline: '{{services}}.', ctaLabel: 'Reserve a table', hasLeadForm: false, sections: [] },
      { slug: 'reservations', name: 'Reservations', heroHeadline: 'Book your table', heroSubheadline: 'Walk-ins welcome, reservations recommended.', ctaLabel: 'Reserve now', hasLeadForm: true, sections: [] },
      { slug: 'contact', name: 'Contact', heroHeadline: 'Find us', heroSubheadline: 'Hours, location and private events.', ctaLabel: 'Contact us', hasLeadForm: true, sections: [] },
    ]),
  },
  FITNESS: {
    key: 'FITNESS',
    label: 'Fitness brand',
    description: 'A results-driven site built to convert trial signups.',
    pages: applyFillToPages((input) => [
      { slug: 'home', name: 'Home', heroHeadline: '{{businessName}} — transform with {{industry}} training', heroSubheadline: 'Programs built for {{targetAudience}}: {{services}}.', ctaLabel: 'Start your free trial', hasLeadForm: true, sections: [benefitsSection(input, 'Why members stay'), trustPlaceholderSection()] },
      { slug: 'programs', name: 'Programs', heroHeadline: 'Find your program', heroSubheadline: '{{services}}.', ctaLabel: 'Start your free trial', hasLeadForm: true, sections: [benefitsSection(input, 'Programs we offer')] },
      { slug: 'trainers', name: 'Trainers', heroHeadline: 'Meet the team', heroSubheadline: 'Certified coaches for {{targetAudience}}.', ctaLabel: 'Start your free trial', hasLeadForm: false, sections: [] },
      { slug: 'contact', name: 'Contact', heroHeadline: 'Questions before you start?', heroSubheadline: "We'll help you pick the right program.", ctaLabel: 'Ask us', hasLeadForm: true, sections: [] },
    ]),
  },
};

export function listPlaybooks() {
  return Object.values(PLAYBOOKS).map((p) => ({ key: p.key, label: p.label, description: p.description }));
}
