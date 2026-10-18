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
  return '{{pageName}} | {{businessName}}';
}
function seoDescriptionPattern() {
  return '{{purpose}}. {{businessName}} serves {{targetAudience}} in {{industry}}.';
}

// ---------------------------------------------------------------------
// Template-family factories — each playbook has ONE real information
// architecture and ONE real set of business functionality (see
// PublicSiteRenderer.tsx for the playbook-specific pages it renders).
// These factories let the Template Library offer many genuinely
// different templates (distinct industry, copy, imagery, page order)
// *within* a family without re-typing — and re-typing wrong — the same
// page/section tree by hand for every one. The seed below matches
// templates by (key, name), so multiple rows can share a playbook key.
// ---------------------------------------------------------------------

type RestaurantOpts = {
  name: string; industryLabel: string; description: string; recommendedUseCase: string;
  complexity?: TemplateSpec['complexity']; heroWord: string; storyHook: string; menuLabel: string;
};
function restaurantTemplate(o: RestaurantOpts): TemplateSpec {
  return {
    key: 'RESTAURANT', name: o.name, industry: o.industryLabel, primaryGoal: 'Reservations', complexity: o.complexity ?? 'SIMPLE',
    description: o.description, recommendedUseCase: o.recommendedUseCase,
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert visitors into a reservation',
        heroHeadlinePattern: `{{businessName}}: ${o.heroWord}`, heroSubheadlinePattern: 'Serving {{targetAudience}} with {{services}}.',
        ctaLabel: 'Reserve a table', hasLeadForm: true,
        sections: [
          { type: 'benefits', heading: 'Why guests love us', bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What guests say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'menu', name: 'Menu', purpose: 'Showcase what you serve',
        heroHeadlinePattern: o.menuLabel, heroSubheadlinePattern: '{{services}}.',
        ctaLabel: 'Reserve a table', hasLeadForm: false,
        sections: [{ type: 'menu-highlights', heading: 'On the menu', bodyPattern: '' }],
      }),
      page({
        slug: 'about', name: 'About', purpose: 'Build trust in the story and the team',
        heroHeadlinePattern: 'Our story', heroSubheadlinePattern: o.storyHook,
        ctaLabel: 'Reserve a table', hasLeadForm: false,
        sections: [{ type: 'expertise', heading: 'Our story', bodyPattern: `{{businessName}} brings {{services}} to {{targetAudience}} — ${o.storyHook.toLowerCase()}` }],
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
  };
}

type HotelOpts = { name: string; description: string; recommendedUseCase: string; heroWord: string; roomsHook: string };
function hotelTemplate(o: HotelOpts): TemplateSpec {
  return {
    key: 'HOTEL', name: o.name, industry: 'Restaurants & hospitality', primaryGoal: 'Bookings', complexity: 'STANDARD',
    description: o.description, recommendedUseCase: o.recommendedUseCase,
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert visitors into a stay inquiry',
        heroHeadlinePattern: `{{businessName}}: ${o.heroWord}`, heroSubheadlinePattern: 'A stay for {{targetAudience}}, built around {{services}}.',
        ctaLabel: 'Check availability', hasLeadForm: true,
        sections: [
          { type: 'rooms-overview', heading: o.roomsHook, bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What guests say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'rooms', name: 'Rooms & Suites', purpose: 'Showcase accommodation options',
        heroHeadlinePattern: 'Rooms & suites', heroSubheadlinePattern: '{{services}}.',
        ctaLabel: 'Check availability', hasLeadForm: false,
        sections: [{ type: 'rooms-overview', heading: 'Where you can stay', bodyPattern: '' }],
      }),
      page({
        slug: 'amenities', name: 'Amenities', purpose: 'Build desire with what the property offers',
        heroHeadlinePattern: 'Amenities & experiences', heroSubheadlinePattern: 'Everything included in your stay.',
        ctaLabel: 'Check availability', hasLeadForm: false,
        sections: [{ type: 'benefits', heading: 'What is included', bodyPattern: '' }],
      }),
      page({
        slug: 'stay', name: 'Book Your Stay', purpose: 'Convert intent into an accommodation inquiry',
        heroHeadlinePattern: 'Book your stay', heroSubheadlinePattern: 'Tell us your dates, we will confirm availability.',
        ctaLabel: 'Check availability', hasLeadForm: true,
      }),
      page({
        slug: 'contact', name: 'Contact', purpose: 'Help guests find and reach the property',
        heroHeadlinePattern: 'Find us', heroSubheadlinePattern: 'Location, directions and front desk hours.',
        ctaLabel: 'Contact us', hasLeadForm: true,
      }),
    ],
  };
}

type CateringOpts = { name: string; description: string; recommendedUseCase: string; heroWord: string };
function cateringTemplate(o: CateringOpts): TemplateSpec {
  return {
    key: 'CATERING', name: o.name, industry: 'Restaurants & hospitality', primaryGoal: 'Event inquiries', complexity: 'STANDARD',
    description: o.description, recommendedUseCase: o.recommendedUseCase,
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert visitors into an event inquiry',
        heroHeadlinePattern: `{{businessName}}: ${o.heroWord}`, heroSubheadlinePattern: 'Catering {{services}} for {{targetAudience}}.',
        ctaLabel: 'Request a quote', hasLeadForm: true,
        sections: [
          { type: 'packages-overview', heading: 'Catering packages', bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What hosts say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'packages', name: 'Packages', purpose: 'Present catering package options',
        heroHeadlinePattern: 'Catering packages', heroSubheadlinePattern: '{{services}}.',
        ctaLabel: 'Request a quote', hasLeadForm: false,
        sections: [{ type: 'packages-overview', heading: 'Choose a package', bodyPattern: '' }],
      }),
      page({
        slug: 'gallery', name: 'Gallery', purpose: 'Prove quality with past events',
        heroHeadlinePattern: 'Past events', heroSubheadlinePattern: 'A look at events we have catered.',
        ctaLabel: 'Request a quote', hasLeadForm: false,
        sections: [{ type: 'results', heading: 'Recent events', bodyPattern: '{{businessName}} has catered {{services}} for {{targetAudience}}. Photos from real events go here.' }],
      }),
      page({
        slug: 'inquire', name: 'Request a Quote', purpose: 'Convert intent into an event inquiry',
        heroHeadlinePattern: 'Request a quote', heroSubheadlinePattern: 'Tell us about your event and we will build a package.',
        ctaLabel: 'Request a quote', hasLeadForm: true,
      }),
      page({
        slug: 'contact', name: 'Contact', purpose: 'Capture a direct inquiry',
        heroHeadlinePattern: 'Get in touch', heroSubheadlinePattern: 'Questions about catering your event.',
        ctaLabel: 'Contact us', hasLeadForm: true,
      }),
    ],
  };
}

type ProServicesOpts = {
  key?: 'PROFESSIONAL_SERVICES' | 'CONSULTANT'; name: string; industryLabel: string; description: string; recommendedUseCase: string;
  heroWord: string; expertiseHook: string; servicesLabel: string;
};
function professionalServicesTemplate(o: ProServicesOpts): TemplateSpec {
  return {
    key: o.key ?? 'PROFESSIONAL_SERVICES', name: o.name, industry: o.industryLabel, primaryGoal: 'Appointments', complexity: 'STANDARD',
    description: o.description, recommendedUseCase: o.recommendedUseCase,
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert visitors into a scheduled consultation',
        heroHeadlinePattern: `{{businessName}}: ${o.heroWord}`, heroSubheadlinePattern: 'Trusted help with {{services}} for {{targetAudience}}.',
        ctaLabel: 'Schedule a consultation', hasLeadForm: true,
        sections: [
          { type: 'benefits', heading: 'Why clients choose us', bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What clients say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'services', name: 'Services', purpose: 'Explain what you offer',
        heroHeadlinePattern: o.servicesLabel, heroSubheadlinePattern: '{{services}}.',
        ctaLabel: 'Schedule a consultation', hasLeadForm: true,
        sections: [{ type: 'practice-areas', heading: 'Areas we handle', bodyPattern: '' }],
      }),
      page({
        slug: 'expertise', name: 'Expertise', purpose: 'Build trust in credentials and experience',
        heroHeadlinePattern: 'Credentials & experience', heroSubheadlinePattern: o.expertiseHook,
        ctaLabel: 'Schedule a consultation', hasLeadForm: false,
        sections: [{ type: 'expertise', heading: 'Our credentials', bodyPattern: `{{businessName}} brings direct experience in {{services}} for {{targetAudience}}. ${o.expertiseHook}` }],
      }),
      page({
        slug: 'case-studies', name: 'Case Studies', purpose: 'Prove results with evidence',
        heroHeadlinePattern: 'Client outcomes', heroSubheadlinePattern: 'Real results for {{targetAudience}}.',
        ctaLabel: 'Schedule a consultation', hasLeadForm: false,
        sections: [
          { type: 'results', heading: 'Outcomes', bodyPattern: 'Clients working with {{businessName}} on {{services}} resolve real, specific problems. Case studies added here build that proof.' },
          { type: 'trust-placeholder', heading: 'What clients say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'book-a-call', name: 'Schedule a Consultation', purpose: 'Convert intent into a scheduled consultation',
        heroHeadlinePattern: 'Schedule a consultation', heroSubheadlinePattern: 'Pick a time that works, no back-and-forth.',
        ctaLabel: 'Schedule now', hasLeadForm: true,
      }),
      page({
        slug: 'contact', name: 'Contact', purpose: 'Capture a direct inquiry',
        heroHeadlinePattern: 'Get in touch', heroSubheadlinePattern: 'Tell us about your situation.',
        ctaLabel: 'Send inquiry', hasLeadForm: true,
      }),
    ],
  };
}

type AgencyOpts = { name: string; industryLabel: string; description: string; recommendedUseCase: string; heroWord: string; processHook: string };
function agencyTemplate(o: AgencyOpts): TemplateSpec {
  return {
    key: 'AGENCY', name: o.name, industry: o.industryLabel, primaryGoal: 'Lead generation', complexity: 'STANDARD',
    description: o.description, recommendedUseCase: o.recommendedUseCase,
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert visitors into project inquiries',
        heroHeadlinePattern: `{{businessName}}: ${o.heroWord}`, heroSubheadlinePattern: 'We deliver {{services}} for {{targetAudience}}.',
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
        heroHeadlinePattern: 'Our process', heroSubheadlinePattern: o.processHook,
        ctaLabel: 'Start a project', hasLeadForm: false,
        sections: [{ type: 'benefits', heading: 'How an engagement runs', bodyPattern: '' }],
      }),
      page({
        slug: 'contact', name: 'Start a Project', purpose: 'Capture project briefs',
        heroHeadlinePattern: "Let's build something", heroSubheadlinePattern: 'Tell us about your project.',
        ctaLabel: 'Start a project', hasLeadForm: true,
      }),
    ],
  };
}

type SalonOpts = {
  key?: 'SALON' | 'FITNESS'; name: string; industryLabel: string; description: string; recommendedUseCase: string;
  heroWord: string; treatmentsLabel: string; bookLabel: string;
};
function salonTemplate(o: SalonOpts): TemplateSpec {
  return {
    key: o.key ?? 'SALON', name: o.name, industry: o.industryLabel, primaryGoal: 'Bookings', complexity: 'STANDARD',
    description: o.description, recommendedUseCase: o.recommendedUseCase,
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert visitors into a booked appointment',
        heroHeadlinePattern: `{{businessName}}: ${o.heroWord}`, heroSubheadlinePattern: '{{services}} for {{targetAudience}}.',
        ctaLabel: 'Book now', hasLeadForm: true,
        sections: [
          { type: 'services-catalog', heading: o.treatmentsLabel, bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What clients say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'treatments', name: 'Treatments', purpose: 'Showcase services, prices and duration',
        heroHeadlinePattern: o.treatmentsLabel, heroSubheadlinePattern: '{{services}}.',
        ctaLabel: 'Book now', hasLeadForm: false,
        sections: [{ type: 'services-catalog', heading: o.bookLabel, bodyPattern: '' }],
      }),
      page({
        slug: 'gallery', name: 'Gallery', purpose: 'Build desire with real results',
        heroHeadlinePattern: 'Our work', heroSubheadlinePattern: 'A look at recent results.',
        ctaLabel: 'Book now', hasLeadForm: false,
        sections: [{ type: 'results', heading: 'Recent work', bodyPattern: '{{businessName}} delivers {{services}} for {{targetAudience}}. Real photos go here.' }],
      }),
      page({
        slug: 'book-a-call', name: 'Book an Appointment', purpose: 'Convert intent into a booked appointment',
        heroHeadlinePattern: 'Book your appointment', heroSubheadlinePattern: 'Pick a service and a time that works.',
        ctaLabel: 'Book now', hasLeadForm: true,
      }),
      page({
        slug: 'contact', name: 'Contact', purpose: 'Help clients find and reach you',
        heroHeadlinePattern: 'Find us', heroSubheadlinePattern: 'Hours and location.',
        ctaLabel: 'Contact us', hasLeadForm: true,
      }),
    ],
  };
}

type EducationOpts = { name: string; description: string; recommendedUseCase: string; heroWord: string; coursesLabel: string };
function educationTemplate(o: EducationOpts): TemplateSpec {
  return {
    key: 'EDUCATION', name: o.name, industry: 'Education & digital services', primaryGoal: 'Enrollment', complexity: 'STANDARD',
    description: o.description, recommendedUseCase: o.recommendedUseCase,
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert visitors into an enrollment inquiry',
        heroHeadlinePattern: `{{businessName}}: ${o.heroWord}`, heroSubheadlinePattern: '{{services}} for {{targetAudience}}.',
        ctaLabel: 'See programs', hasLeadForm: true,
        sections: [
          { type: 'courses-overview', heading: o.coursesLabel, bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What students say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'programs', name: 'Programs', purpose: 'Present course/program catalog',
        heroHeadlinePattern: o.coursesLabel, heroSubheadlinePattern: '{{services}}.',
        ctaLabel: 'Enroll now', hasLeadForm: true,
        sections: [{ type: 'courses-overview', heading: 'Programs we offer', bodyPattern: '' }],
      }),
      page({
        slug: 'instructors', name: 'Instructors', purpose: 'Build trust in who is teaching',
        heroHeadlinePattern: 'Meet your instructors', heroSubheadlinePattern: 'Experienced in {{industry}}.',
        ctaLabel: 'See programs', hasLeadForm: false,
        sections: [{ type: 'expertise', heading: 'Why learn with us', bodyPattern: '{{businessName}} teaches {{services}} directly, built on real experience with {{targetAudience}}.' }],
      }),
      page({
        slug: 'book-a-call', name: 'Free Consultation', purpose: 'Convert intent into a scheduled consultation',
        heroHeadlinePattern: 'Book a free consultation', heroSubheadlinePattern: "Not sure which program fits? Let's talk.",
        ctaLabel: 'Schedule now', hasLeadForm: true,
      }),
      page({
        slug: 'contact', name: 'Contact', purpose: 'Capture a direct inquiry',
        heroHeadlinePattern: 'Questions?', heroSubheadlinePattern: "We'll help you pick the right program.",
        ctaLabel: 'Ask us', hasLeadForm: true,
      }),
    ],
  };
}

type LocalServicesOpts = { name: string; description: string; recommendedUseCase: string; heroWord: string; servicesLabel: string };
function localServicesTemplate(o: LocalServicesOpts): TemplateSpec {
  return {
    key: 'LOCAL_SERVICES', name: o.name, industry: 'Local & home services', primaryGoal: 'Quote requests', complexity: 'SIMPLE',
    description: o.description, recommendedUseCase: o.recommendedUseCase,
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert first-time visitors into a quote request',
        heroHeadlinePattern: `{{businessName}}: ${o.heroWord}`, heroSubheadlinePattern: 'Local, reliable, and ready to help with {{services}}.',
        ctaLabel: 'Get a free quote', hasLeadForm: true,
        sections: [
          { type: 'services-catalog', heading: o.servicesLabel, bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What customers say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'services', name: 'Services', purpose: 'Explain what you offer',
        heroHeadlinePattern: o.servicesLabel, heroSubheadlinePattern: '{{services}}.',
        ctaLabel: 'Get a free quote', hasLeadForm: false,
        sections: [{ type: 'services-catalog', heading: 'What we handle', bodyPattern: '' }],
      }),
      page({
        slug: 'work', name: 'Our Work', purpose: 'Prove quality with completed projects',
        heroHeadlinePattern: 'Completed projects', heroSubheadlinePattern: 'Real jobs for {{targetAudience}}.',
        ctaLabel: 'Get a free quote', hasLeadForm: false,
        sections: [{ type: 'results', heading: 'Recent projects', bodyPattern: '{{businessName}} has completed {{services}} for {{targetAudience}}. Photos of real jobs go here.' }],
      }),
      page({
        slug: 'quote', name: 'Get a Quote', purpose: 'Convert intent into a quote request',
        heroHeadlinePattern: 'Get a free quote', heroSubheadlinePattern: 'Tell us about the job, no obligation.',
        ctaLabel: 'Request a free quote', hasLeadForm: true,
      }),
      page({
        slug: 'contact', name: 'Contact', purpose: 'Help customers reach you directly',
        heroHeadlinePattern: 'Get in touch', heroSubheadlinePattern: 'Call, text or send a message.',
        ctaLabel: 'Contact us', hasLeadForm: true,
      }),
    ],
  };
}

type EcommerceOpts = { name: string; description: string; recommendedUseCase: string; heroWord: string; collectionLabel: string };
function ecommerceTemplate(o: EcommerceOpts): TemplateSpec {
  return {
    key: 'ECOMMERCE', name: o.name, industry: 'Ecommerce & retail', primaryGoal: 'Sales', complexity: 'STANDARD', isEcommerce: true,
    description: o.description, recommendedUseCase: o.recommendedUseCase,
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert first-time visitors into shoppers',
        heroHeadlinePattern: `{{businessName}}: ${o.heroWord}`, heroSubheadlinePattern: 'Shop {{services}} with fast, reliable delivery.',
        ctaLabel: 'Shop now', hasLeadForm: true,
        sections: [
          { type: 'featured-products', heading: 'Featured products', bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What customers say', bodyPattern: '' },
          { type: 'benefits', heading: 'Why shop with us', bodyPattern: 'Free shipping over a threshold, easy returns, and real support. {{businessName}} makes buying {{services}} simple.' },
        ],
      }),
      page({
        slug: 'collections', name: 'Collections', purpose: 'Help shoppers browse by category',
        heroHeadlinePattern: o.collectionLabel, heroSubheadlinePattern: '{{services}}.',
        ctaLabel: 'Shop now', hasLeadForm: false,
        sections: [{ type: 'featured-products', heading: 'Shop by collection', bodyPattern: '' }],
      }),
      page({
        slug: 'about', name: 'About', purpose: 'Build trust in the brand',
        heroHeadlinePattern: 'About {{businessName}}', heroSubheadlinePattern: 'Our story and why customers come back.',
        ctaLabel: 'Shop now', hasLeadForm: false,
        sections: [{ type: 'expertise', heading: 'Our story', bodyPattern: '{{businessName}} exists to make {{services}} genuinely good, for {{targetAudience}}.' }],
      }),
      page({
        slug: 'contact', name: 'Contact', purpose: 'Capture order and support inquiries',
        heroHeadlinePattern: 'Get in touch', heroSubheadlinePattern: 'Orders, returns and questions.',
        ctaLabel: 'Contact us', hasLeadForm: true,
      }),
    ],
  };
}

type PortfolioOpts = {
  key?: 'CREATOR' | 'PERSONAL_BRAND'; name: string; industryLabel: string; description: string; recommendedUseCase: string;
  heroWord: string; portfolioLabel: string; offersLabel: string;
};
function portfolioTemplate(o: PortfolioOpts): TemplateSpec {
  return {
    key: o.key ?? 'CREATOR', name: o.name, industry: o.industryLabel, primaryGoal: 'Inquiries', complexity: 'STANDARD',
    description: o.description, recommendedUseCase: o.recommendedUseCase,
    pages: [
      page({
        slug: 'home', name: 'Home', purpose: 'Convert visitors into project inquiries',
        heroHeadlinePattern: `{{businessName}}: ${o.heroWord}`, heroSubheadlinePattern: '{{services}} for {{targetAudience}}.',
        ctaLabel: 'Inquire now', hasLeadForm: true,
        sections: [
          { type: 'benefits', heading: o.portfolioLabel, bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What clients say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'portfolio', name: 'Portfolio', purpose: 'Showcase visual work as proof',
        heroHeadlinePattern: o.portfolioLabel, heroSubheadlinePattern: 'Recent {{services}}.',
        ctaLabel: 'Inquire now', hasLeadForm: false,
        sections: [{ type: 'results', heading: 'Selected work', bodyPattern: 'A sample of {{services}} delivered for {{targetAudience}}. Real project photos go here.' }],
      }),
      page({
        slug: 'offers', name: 'Packages', purpose: 'Present ways to work together',
        heroHeadlinePattern: o.offersLabel, heroSubheadlinePattern: '{{services}}.',
        ctaLabel: 'Inquire now', hasLeadForm: true,
        sections: [{ type: 'benefits', heading: 'Ways to work together', bodyPattern: '' }],
      }),
      page({
        slug: 'about', name: 'About', purpose: 'Build trust in the person behind the work',
        heroHeadlinePattern: 'About {{businessName}}', heroSubheadlinePattern: 'My background and approach.',
        ctaLabel: 'Inquire now', hasLeadForm: false,
        sections: [{ type: 'expertise', heading: 'My story', bodyPattern: '{{businessName}} has focused on {{services}} for {{targetAudience}}, built on real experience.' }],
      }),
      page({
        slug: 'contact', name: 'Contact', purpose: 'Capture a direct project inquiry',
        heroHeadlinePattern: "Let's work together", heroSubheadlinePattern: 'Tell us about your project.',
        ctaLabel: 'Send inquiry', hasLeadForm: true,
      }),
    ],
  };
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
        heroHeadlinePattern: '{{businessName}} helps you transform with {{industry}} training',
        heroSubheadlinePattern: 'Programs built for {{targetAudience}}: {{services}}.',
        ctaLabel: 'Start your free trial', hasLeadForm: true,
        sections: [
          { type: 'benefits', heading: 'Why members stay', bodyPattern: '' },
          { type: 'transformations', heading: 'Real transformations', bodyPattern: "Members of {{businessName}} have used {{services}} to hit goals they'd stalled on for years. Real progress, not before/after gimmicks." },
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
        sections: [{ type: 'expertise', heading: 'Why our coaching works', bodyPattern: 'Every coach at {{businessName}} is certified and trained specifically in {{services}}, not generic programming.' }],
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
        slug: 'book-a-call', name: 'Book a Session', purpose: 'Convert intent into a scheduled session',
        heroHeadlinePattern: 'Book your first session', heroSubheadlinePattern: 'Pick a time that works, no back-and-forth.',
        ctaLabel: 'Schedule now', hasLeadForm: true,
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
        heroHeadlinePattern: '{{businessName}}: {{industry}} for {{targetAudience}}', heroSubheadlinePattern: 'Shop {{services}} with fast, reliable delivery.',
        ctaLabel: 'Shop now', hasLeadForm: true,
        sections: [
          { type: 'featured-products', heading: 'Featured products', bodyPattern: '' },
          { type: 'trust-placeholder', heading: 'What customers say', bodyPattern: '' },
          { type: 'benefits', heading: 'Why shop with us', bodyPattern: 'Free shipping over a threshold, easy returns, and real support. {{businessName}} makes buying {{services}} simple.' },
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
        sections: [{ type: 'offers', heading: 'Complete the look', bodyPattern: "Shoppers who buy {{services}} from {{businessName}} often add one more item, a real opportunity to increase order value here." }],
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
        heroHeadlinePattern: '{{businessName}}: {{industry}} consulting for {{targetAudience}}', heroSubheadlinePattern: 'Practical help with {{services}}.',
        ctaLabel: 'Book a consultation', hasLeadForm: true,
        sections: [
          { type: 'expertise', heading: 'How we help', bodyPattern: '{{businessName}} brings hands-on {{industry}} experience to {{targetAudience}}: direct implementation of {{services}}, not theory.' },
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
          { type: 'results', heading: 'Results', bodyPattern: 'Clients working with {{businessName}} on {{services}} see measurable change. Real case studies appear here once added.' },
          { type: 'trust-placeholder', heading: 'What clients say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'about', name: 'About', purpose: 'Build trust and credibility',
        heroHeadlinePattern: 'Why {{targetAudience}} choose {{businessName}}', heroSubheadlinePattern: 'Our story and approach.',
        ctaLabel: 'Book a consultation', hasLeadForm: false,
        sections: [{ type: 'expertise', heading: 'Background & approach', bodyPattern: '{{businessName}} has focused specifically on {{industry}} for {{targetAudience}}: deep, not broad.' }],
      }),
      page({
        slug: 'book-a-call', name: 'Book a Call', purpose: 'Convert intent into a scheduled call',
        heroHeadlinePattern: 'Book a call', heroSubheadlinePattern: 'Pick a time that works, no back-and-forth.',
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
        heroHeadlinePattern: '{{businessName}}: {{industry}} agency for {{targetAudience}}', heroSubheadlinePattern: 'We deliver {{services}}.',
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
        heroHeadlinePattern: '{{businessName}}: {{industry}}', heroSubheadlinePattern: 'Serving {{targetAudience}} with {{services}}.',
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
        heroHeadlinePattern: '{{businessName}}: {{industry}} for {{targetAudience}}', heroSubheadlinePattern: 'Explore {{services}}.',
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
        heroHeadlinePattern: '{{businessName}}: trusted {{industry}} serving {{targetAudience}}', heroSubheadlinePattern: 'Local, reliable, and ready to help with {{services}}.',
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
        sections: [{ type: 'results', heading: 'Recent work', bodyPattern: 'Examples of {{services}} completed for {{targetAudience}}. Real jobs, once added here.' }],
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
        heroHeadlinePattern: '{{businessName}}: {{industry}} for {{targetAudience}}', heroSubheadlinePattern: 'Ideas and work on {{services}}.',
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
        heroHeadlinePattern: 'Join the newsletter', heroSubheadlinePattern: 'No spam, just {{services}}, occasionally.',
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
        heroHeadlinePattern: '{{businessName}}: {{industry}} for {{targetAudience}}', heroSubheadlinePattern: 'Trusted help with {{services}}.',
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
          { type: 'results', heading: 'Outcomes', bodyPattern: 'Clients working with {{businessName}} on {{services}} resolve real, specific problems. Case studies added here build that proof.' },
          { type: 'trust-placeholder', heading: 'What clients say', bodyPattern: '' },
        ],
      }),
      page({
        slug: 'book-a-call', name: 'Schedule a Consultation', purpose: 'Convert intent into a scheduled consultation',
        heroHeadlinePattern: 'Schedule a consultation', heroSubheadlinePattern: 'Pick a time that works, no back-and-forth.',
        ctaLabel: 'Schedule now', hasLeadForm: true,
      }),
      page({
        slug: 'contact', name: 'Contact', purpose: 'Capture a direct inquiry',
        heroHeadlinePattern: 'Get in touch', heroSubheadlinePattern: 'Tell us about your situation.',
        ctaLabel: 'Send inquiry', hasLeadForm: true,
      }),
    ],
  },

  // --- Restaurants & Hospitality -----------------------------------
  restaurantTemplate({
    name: 'Fine Dining Restaurant', industryLabel: 'Fine dining', complexity: 'ADVANCED',
    description: 'An elevated, image-led site built for a tasting-menu or chef-driven dining room.',
    recommendedUseCase: 'Best for fine dining restaurants and chef-led concepts taking reservations for a premium experience.',
    heroWord: 'refined {{industry}} dining for {{targetAudience}}', storyHook: 'A kitchen built around technique and seasonality.',
    menuLabel: 'Tasting menu',
  }),
  restaurantTemplate({
    name: 'Casual Neighborhood Restaurant', industryLabel: 'Casual dining',
    description: 'A warm, approachable site for a neighborhood spot that wants more walk-ins and reservations.',
    recommendedUseCase: 'Best for casual restaurants, diners and family spots serving a local neighborhood.',
    heroWord: 'your neighborhood spot for {{targetAudience}}', storyHook: 'A regular table for regular people.',
    menuLabel: 'What we serve',
  }),
  restaurantTemplate({
    name: 'Cafe & Coffee Shop', industryLabel: 'Cafe & coffee',
    description: 'A cozy, visual site built for a coffee shop or cafe filling tables and growing regulars.',
    recommendedUseCase: 'Best for cafes, coffee shops and espresso bars taking in-person orders and light reservations.',
    heroWord: 'coffee and {{services}} for {{targetAudience}}', storyHook: 'Good coffee, made for staying a while.',
    menuLabel: 'Coffee & menu',
  }),
  restaurantTemplate({
    name: 'Bakery & Patisserie', industryLabel: 'Bakery & patisserie',
    description: 'A product-forward site built to showcase baked goods and take custom orders and reservations.',
    recommendedUseCase: 'Best for bakeries, patisseries and dessert shops showcasing daily and custom items.',
    heroWord: 'fresh {{services}}, baked daily for {{targetAudience}}', storyHook: 'Everything made from scratch, every morning.',
    menuLabel: "Today's bakes",
  }),
  restaurantTemplate({
    name: 'Bar & Lounge', industryLabel: 'Bar & lounge',
    description: 'A moody, nightlife-ready site built for a bar or lounge filling tables and taking group bookings.',
    recommendedUseCase: 'Best for bars, lounges and cocktail rooms taking reservations for groups and events.',
    heroWord: 'cocktails and {{services}} for {{targetAudience}}', storyHook: 'A bar built for staying past one drink.',
    menuLabel: 'Drinks & bites',
  }),

  hotelTemplate({
    name: 'Boutique Hotel & Stay',
    description: 'A real accommodation-inquiry site for a boutique hotel or stay — not a restaurant reservation form.',
    recommendedUseCase: 'Best for boutique hotels, inns and short-stay properties taking check-in/check-out inquiries.',
    heroWord: 'a boutique stay for {{targetAudience}}', roomsHook: 'Where you will stay',
  }),

  cateringTemplate({
    name: 'Catering & Events Co.',
    description: 'An event-inquiry site for a catering business — real event date, guest count and package fields, not a table reservation.',
    recommendedUseCase: 'Best for catering companies and event food businesses taking event inquiries and quoting packages.',
    heroWord: 'catering {{services}} for {{targetAudience}}',
  }),

  // --- Professional Services ---------------------------------------
  professionalServicesTemplate({
    name: 'Law Firm', industryLabel: 'Legal services',
    description: 'A credibility-first site built to convert inquiries into scheduled consultations for a law practice.',
    recommendedUseCase: 'Best for law firms and solo attorneys converting inquiries into booked consultations.',
    heroWord: 'legal counsel for {{targetAudience}}', servicesLabel: 'Practice areas',
    expertiseHook: 'Licensed and experienced, focused specifically on this area of law.',
  }),
  professionalServicesTemplate({
    name: 'Accounting Firm', industryLabel: 'Accounting & tax',
    description: 'A trust-first site built for an accounting or bookkeeping practice converting inquiries into bookings.',
    recommendedUseCase: 'Best for accounting, bookkeeping and tax practices selling ongoing or seasonal engagements.',
    heroWord: 'accounting for {{targetAudience}}', servicesLabel: 'Our services',
    expertiseHook: 'Certified and current on the rules that actually affect your filing.',
  }),
  professionalServicesTemplate({
    name: 'Financial Advisory', industryLabel: 'Financial advisory',
    description: 'A credibility-first site built for a financial advisory practice converting inquiries into consultations.',
    recommendedUseCase: 'Best for financial advisors and wealth managers selling ongoing advisory relationships.',
    heroWord: 'financial planning for {{targetAudience}}', servicesLabel: 'Advisory services',
    expertiseHook: 'A fiduciary approach, built around your actual goals.',
  }),
  professionalServicesTemplate({
    name: 'Architecture & Interior Design', industryLabel: 'Architecture & interior design',
    description: 'A portfolio-and-booking site for an architecture or interior design practice converting inquiries into consultations.',
    recommendedUseCase: 'Best for architecture and interior design studios that both showcase projects and book consultations.',
    heroWord: 'architecture & design for {{targetAudience}}', servicesLabel: 'Design services',
    expertiseHook: 'Every project grounded in how the space will actually be lived in.',
  }),

  professionalServicesTemplate({
    key: 'CONSULTANT', name: 'Business Coaching', industryLabel: 'Business coaching',
    description: 'An authority-building site that converts inquiries into booked coaching calls.',
    recommendedUseCase: 'Best for business coaches selling 1:1 or group coaching engagements.',
    heroWord: 'business coaching for {{targetAudience}}', servicesLabel: 'Coaching programs',
    expertiseHook: 'Direct, practical coaching — not theory.',
  }),

  agencyTemplate({
    name: 'Marketing Agency', industryLabel: 'Marketing & advertising',
    description: 'A results-first site that turns visitors into project inquiries for a marketing agency.',
    recommendedUseCase: 'Best for marketing, advertising and growth agencies pitching retainers or campaigns.',
    heroWord: 'marketing for {{targetAudience}}', processHook: 'From strategy to execution, in one engagement.',
  }),
  agencyTemplate({
    name: 'Creative Studio', industryLabel: 'Creative & design studios',
    description: 'A portfolio-first site that turns visitors into project inquiries for a design or creative studio.',
    recommendedUseCase: 'Best for design, branding or creative studios pitching project-based work.',
    heroWord: 'creative work for {{targetAudience}}', processHook: 'From concept to final delivery, collaboratively.',
  }),

  // --- Beauty, Health & Wellness ------------------------------------
  salonTemplate({
    name: 'Beauty Salon & Spa', industryLabel: 'Beauty & wellness',
    description: 'A treatment-and-booking site for a beauty salon, built around real services, prices and appointment times.',
    recommendedUseCase: 'Best for beauty salons and day spas taking service-based appointment bookings.',
    heroWord: 'beauty treatments for {{targetAudience}}', treatmentsLabel: 'Treatments & pricing', bookLabel: 'Choose your treatment',
  }),
  salonTemplate({
    name: 'Hair Salon', industryLabel: 'Hair & beauty',
    description: 'A service-and-booking site for a hair salon, built around real services, prices and durations.',
    recommendedUseCase: 'Best for hair salons and barbershops taking service-based appointment bookings.',
    heroWord: 'hair care for {{targetAudience}}', treatmentsLabel: 'Services & pricing', bookLabel: 'Choose your service',
  }),
  salonTemplate({
    name: 'Med Spa', industryLabel: 'Med spa & aesthetics',
    description: 'A credibility-and-booking site for a med spa, built around real services, prices and durations.',
    recommendedUseCase: 'Best for med spas and aesthetics practices taking service-based appointment bookings.',
    heroWord: 'aesthetic treatments for {{targetAudience}}', treatmentsLabel: 'Treatments & pricing', bookLabel: 'Choose your treatment',
  }),
  salonTemplate({
    name: 'Nail Studio', industryLabel: 'Nail care',
    description: 'A service-and-booking site for a nail studio, built around real services, prices and durations.',
    recommendedUseCase: 'Best for nail studios and salons taking service-based appointment bookings.',
    heroWord: 'nail care for {{targetAudience}}', treatmentsLabel: 'Services & pricing', bookLabel: 'Choose your service',
  }),
  salonTemplate({
    name: 'Spa & Wellness', industryLabel: 'Spa & wellness',
    description: 'A calming, booking-ready site for a spa or wellness studio built around real services and durations.',
    recommendedUseCase: 'Best for spas, massage studios and wellness centers taking service-based appointment bookings.',
    heroWord: 'wellness treatments for {{targetAudience}}', treatmentsLabel: 'Treatments & pricing', bookLabel: 'Choose your treatment',
  }),
  salonTemplate({
    name: 'Wellness Practitioner', industryLabel: 'Wellness practice',
    description: 'A trust-first, booking-ready site for an individual wellness practitioner (massage, acupuncture, bodywork).',
    recommendedUseCase: 'Best for individual wellness practitioners offering appointment-based sessions.',
    heroWord: 'wellness sessions for {{targetAudience}}', treatmentsLabel: 'Sessions & pricing', bookLabel: 'Choose your session',
  }),
  salonTemplate({
    key: 'FITNESS', name: 'Personal Trainer', industryLabel: 'Personal training',
    description: 'A results-and-booking site for a personal trainer selling sessions and packages.',
    recommendedUseCase: 'Best for personal trainers selling 1:1 sessions, consultations or training packages.',
    heroWord: 'personal training for {{targetAudience}}', treatmentsLabel: 'Sessions & packages', bookLabel: 'Choose your session',
  }),
  salonTemplate({
    key: 'FITNESS', name: 'Fitness Studio', industryLabel: 'Fitness studio',
    description: 'A class-and-booking site for a fitness studio converting visitors into trial bookings.',
    recommendedUseCase: 'Best for fitness studios and gyms taking class or trial-session bookings.',
    heroWord: 'training for {{targetAudience}}', treatmentsLabel: 'Classes & pricing', bookLabel: 'Choose your class',
  }),

  // --- Retail & Ecommerce -------------------------------------------
  ecommerceTemplate({
    name: 'Fashion Boutique',
    description: 'A visual, product-led storefront for a fashion or apparel boutique.',
    recommendedUseCase: 'Best for fashion boutiques and apparel brands selling direct to consumer.',
    heroWord: 'curated fashion for {{targetAudience}}', collectionLabel: 'Shop the collection',
  }),
  ecommerceTemplate({
    name: 'Beauty Products Store',
    description: 'A product-led storefront for a beauty or skincare brand.',
    recommendedUseCase: 'Best for beauty, skincare and cosmetics brands selling direct to consumer.',
    heroWord: 'beauty essentials for {{targetAudience}}', collectionLabel: 'Shop by category',
  }),
  ecommerceTemplate({
    name: 'Home & Lifestyle Store',
    description: 'A product-led storefront for a home goods or lifestyle brand.',
    recommendedUseCase: 'Best for home goods, decor and lifestyle brands selling direct to consumer.',
    heroWord: 'home goods for {{targetAudience}}', collectionLabel: 'Shop the collection',
  }),
  ecommerceTemplate({
    name: 'Specialty Retail Store',
    description: 'A focused, product-led storefront for a specialty retail niche.',
    recommendedUseCase: 'Best for specialty retailers with a focused catalog selling direct to consumer.',
    heroWord: 'specialty goods for {{targetAudience}}', collectionLabel: 'Shop the collection',
  }),
  ecommerceTemplate({
    name: 'Digital Products Store',
    description: 'A conversion-focused storefront built for downloadable or digital products.',
    recommendedUseCase: 'Best for creators and businesses selling templates, ebooks or other digital products.',
    heroWord: 'digital products for {{targetAudience}}', collectionLabel: 'Browse products',
  }),

  // --- Creative & Personal Brands -------------------------------------
  portfolioTemplate({
    name: 'Photographer Portfolio', industryLabel: 'Photography',
    description: 'A visual-first portfolio site built for a photographer converting visitors into booking inquiries.',
    recommendedUseCase: 'Best for photographers showcasing projects and photography packages.',
    heroWord: 'photography for {{targetAudience}}', portfolioLabel: 'Selected shoots', offersLabel: 'Photography packages',
  }),
  portfolioTemplate({
    name: 'Videographer Portfolio', industryLabel: 'Videography',
    description: 'A visual-first portfolio site built for a videographer converting visitors into booking inquiries.',
    recommendedUseCase: 'Best for videographers showcasing reels and production packages.',
    heroWord: 'video production for {{targetAudience}}', portfolioLabel: 'Selected films', offersLabel: 'Production packages',
  }),
  portfolioTemplate({
    name: 'Designer Portfolio', industryLabel: 'Design',
    description: 'A visual-first portfolio site built for an independent designer converting visitors into project inquiries.',
    recommendedUseCase: 'Best for independent designers showcasing case studies and project work.',
    heroWord: 'design for {{targetAudience}}', portfolioLabel: 'Selected projects', offersLabel: 'Design packages',
  }),
  portfolioTemplate({
    key: 'PERSONAL_BRAND', name: 'Creator & Influencer Media Kit', industryLabel: 'Creators & influencers',
    description: 'A media-kit-style site built for a creator to showcase audience, content and brand collaborations.',
    recommendedUseCase: 'Best for creators and influencers showcasing their audience, content and collaboration history.',
    heroWord: 'content and collaborations for {{targetAudience}}', portfolioLabel: 'Content & audience', offersLabel: 'Collaborate with me',
  }),

  // --- Education & Digital Services -----------------------------------
  educationTemplate({
    name: 'Online Coach & Course Creator',
    description: 'A program-led site for an online coach or course creator converting visitors into enrollment inquiries.',
    recommendedUseCase: 'Best for online coaches and course creators selling programs or cohort-based courses.',
    heroWord: 'coaching & courses for {{targetAudience}}', coursesLabel: 'Programs & courses',
  }),
  educationTemplate({
    name: 'Education Business',
    description: 'A program-led site for an education business converting visitors into enrollment inquiries.',
    recommendedUseCase: 'Best for tutoring services, schools and education businesses selling structured programs.',
    heroWord: 'education for {{targetAudience}}', coursesLabel: 'Programs we offer',
  }),
  educationTemplate({
    name: 'Training Provider',
    description: 'A program-led site for a training provider converting visitors into enrollment inquiries.',
    recommendedUseCase: 'Best for professional training providers and certification programs.',
    heroWord: 'training for {{targetAudience}}', coursesLabel: 'Training programs',
  }),
  educationTemplate({
    name: 'Membership Business',
    description: 'A program-led site for a membership business converting visitors into enrollment inquiries.',
    recommendedUseCase: 'Best for membership communities and subscription-based learning businesses.',
    heroWord: 'membership for {{targetAudience}}', coursesLabel: 'Membership tiers',
  }),

  // --- Local & Home Services -------------------------------------------
  localServicesTemplate({
    name: 'Cleaning Company',
    description: 'A trust-first, quote-request site for a residential or commercial cleaning company.',
    recommendedUseCase: 'Best for cleaning companies taking quote requests across a defined service area.',
    heroWord: 'cleaning services for {{targetAudience}}', servicesLabel: 'Cleaning services',
  }),
  localServicesTemplate({
    name: 'Landscaping',
    description: 'A trust-first, quote-request site for a landscaping or lawn care business.',
    recommendedUseCase: 'Best for landscaping and lawn care businesses taking quote requests by service area.',
    heroWord: 'landscaping for {{targetAudience}}', servicesLabel: 'Landscaping services',
  }),
  localServicesTemplate({
    name: 'Contractor',
    description: 'A trust-first, quote-request site for a general contractor or renovation business.',
    recommendedUseCase: 'Best for general contractors and renovation businesses taking project quote requests.',
    heroWord: 'contracting for {{targetAudience}}', servicesLabel: 'Services we offer',
  }),
  localServicesTemplate({
    name: 'Plumbing & Electrical Services',
    description: 'A trust-first, quote-request site for a plumbing or electrical services business.',
    recommendedUseCase: 'Best for plumbing and electrical businesses taking quote requests and emergency inquiries.',
    heroWord: 'plumbing & electrical for {{targetAudience}}', servicesLabel: 'Services we offer',
  }),
  localServicesTemplate({
    name: 'Moving Company',
    description: 'A trust-first, quote-request site for a moving company.',
    recommendedUseCase: 'Best for moving companies taking quote requests by move date and service area.',
    heroWord: 'moving services for {{targetAudience}}', servicesLabel: 'Moving services',
  }),
  localServicesTemplate({
    name: 'Automotive Services',
    description: 'A trust-first, quote-request site for an automotive repair or detailing business.',
    recommendedUseCase: 'Best for auto repair, detailing and mobile automotive service businesses.',
    heroWord: 'automotive services for {{targetAudience}}', servicesLabel: 'Services we offer',
  }),
  localServicesTemplate({
    name: 'Pet Care',
    description: 'A trust-first, quote-request site for a pet care, grooming or dog-walking business.',
    recommendedUseCase: 'Best for pet care, grooming and dog-walking businesses taking quote requests.',
    heroWord: 'pet care for {{targetAudience}}', servicesLabel: 'Pet care services',
  }),
];

async function main() {
  let created = 0;
  let updated = 0;

  for (const spec of TEMPLATES) {
    // Matched by (key, name), not key alone — the Template Marketplace
    // expansion puts several distinct templates on the same playbook key
    // (e.g. five different RESTAURANT templates), so key alone can no
    // longer identify "this template" for the refresh-in-place path.
    const existing = await prisma.template.findFirst({ where: { key: spec.key as never, name: spec.name } });

    // A template with this key already exists — refresh its copy in place
    // (name, patterns, section bodies) rather than skipping, so wording
    // fixes made here reach templates that were seeded before the fix.
    // Sites already generated from this template keep their own copied
    // text untouched; only the reusable template patterns change.
    if (existing) {
      await prisma.template.update({
        where: { id: existing.id },
        data: {
          name: spec.name,
          industry: spec.industry,
          primaryGoal: spec.primaryGoal,
          complexity: spec.complexity,
          description: spec.description,
          recommendedUseCase: spec.recommendedUseCase,
          isEcommerce: spec.isEcommerce ?? false,
        },
      });

      for (const [i, p] of spec.pages.entries()) {
        const pageData = {
          name: p.name,
          order: i,
          purpose: p.purpose,
          heroHeadlinePattern: p.heroHeadlinePattern,
          heroSubheadlinePattern: p.heroSubheadlinePattern,
          ctaLabel: p.ctaLabel,
          hasLeadForm: p.hasLeadForm,
          seoTitlePattern: seoTitlePattern(),
          seoDescriptionPattern: seoDescriptionPattern(),
        };
        const page = await prisma.templatePage.upsert({
          where: { templateId_slug: { templateId: existing.id, slug: p.slug } },
          update: pageData,
          create: { ...pageData, templateId: existing.id, slug: p.slug },
        });

        // Sections have no natural key to diff against, so the simplest
        // correct move is a full replace rather than trying to match old
        // rows to new ones.
        await prisma.templateSection.deleteMany({ where: { templatePageId: page.id } });
        if (p.sections.length) {
          await prisma.templateSection.createMany({
            data: p.sections.map((s, j) => ({ templatePageId: page.id, type: s.type, heading: s.heading, bodyPattern: s.bodyPattern, order: j })),
          });
        }
      }

      updated += 1;
      console.log(`  Updated ${spec.name} (${spec.key}) with refreshed copy for ${spec.pages.length} pages.`);
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

  console.log(`Template Library seed complete: ${created} created, ${updated} updated.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
