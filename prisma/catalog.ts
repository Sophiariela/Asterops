/**
 * Catálogo comercial da Aster — fonte do seed.
 *
 * Quatro categorias e as soluções de cada uma. Todo texto aqui é editável
 * depois pelo painel: isto existe para o catálogo nascer com conteúdo real
 * em vez de card raso, não para congelar copy.
 *
 * Regras que valem para todo item:
 *  - `availability` separa produto que já roda de desenvolvimento sob medida
 *    e de demonstração. Nada é apresentado como pronto se ainda precisa ser
 *    construído.
 *  - `priceLabel` nunca inventa valor. Sem preço fechado, pede estimativa.
 *  - `previewImage` só aponta para screenshot de projeto que existe. Solução
 *    sem imagem real fica sem imagem, de propósito.
 */

export type CommercialModel =
  | "FIXED_SCOPE"
  | "CUSTOM_QUOTE"
  | "SETUP_PLUS_MAINTENANCE"
  | "SUBSCRIPTION";

export type SolutionAvailability =
  | "OPERATIONAL_PRODUCT"
  | "CUSTOM_DEVELOPMENT"
  | "DEMONSTRATION";

export interface CatalogFaq {
  question: string;
  answer: string;
}

export interface CatalogSolution {
  title: string;
  slug: string;
  icon: string;
  /** Descrição curta, para cartão de listagem. */
  description: string;
  /** Resultado em uma linha. */
  outcome: string;
  headline: string;
  problem: string;
  idealCustomer: string;
  capabilities: string[];
  functionality: string[];
  useCases: string[];
  integrations: string[];
  scopeNotes: string;
  implementationNote: string;
  commercialModel: CommercialModel;
  availability: SolutionAvailability;
  priceLabel?: string;
  ctaLabel: string;
  previewImage?: string;
  previewCaption?: string;
  featured?: boolean;
  faqs: CatalogFaq[];
}

export interface CatalogCategory {
  code: string;
  name: string;
  slug: string;
  icon: string;
  tagline: string;
  description: string;
  solutions: CatalogSolution[];
}

const ESTIMATE = "Request a project estimate.";

export const catalog: CatalogCategory[] = [
  {
    code: "01",
    name: "Web & Digital Experience",
    slug: "web-digital-experience",
    icon: "Globe",
    tagline: "The surface your customers actually meet.",
    description:
      "Digital experiences designed to attract customers, communicate value, and convert visitors.",
    solutions: [
      {
        title: "Business Website Development",
        slug: "business-website-development",
        icon: "Globe",
        description:
          "A professional website for a business that needs to be found, understood, and contacted — built custom, not assembled from a template.",
        outcome: "Customers find you, understand what you do, and get in touch.",
        headline: "A website that explains your business and brings you contacts.",
        problem:
          "Most businesses are either invisible online or represented by a page that loads slowly, says nothing specific, and gives no obvious way to make contact. Customers who search for you find a competitor instead, or find you and leave unconvinced.",
        idealCustomer:
          "Established businesses and professional practices that get customers through search, referral or social media, and need a credible place for those people to land.",
        capabilities: [
          "Custom design built around your services, not a stock layout",
          "Responsive layouts tested on real phones, not just resized in a browser",
          "Multi-page structure for services, products, team and contact",
          "Contact and enquiry forms that persist submissions you can act on",
          "SEO fundamentals and analytics configured at launch",
        ],
        functionality: [
          "Page structure and navigation designed around what visitors look for first",
          "Service and product presentation with room for real detail, pricing and imagery",
          "Enquiry forms with validation, spam resistance and a confirmation state",
          "WhatsApp contact links with a pre-written message, when requested",
          "Metadata, sitemap, robots and Open Graph previews for search and sharing",
          "Analytics integration so you can see which pages produce contacts",
          "CMS or content editing when included in scope, so copy changes do not need a developer",
          "Deployment, domain and SSL configuration handled by the studio",
        ],
        useCases: [
          "A service business replacing a slow, outdated site that produces no enquiries",
          "A professional practice that needs credibility before a first consultation",
          "A multi-location business that needs each location findable",
          "A company consolidating information currently scattered across social profiles",
        ],
        integrations: [
          "Google Analytics / GA4",
          "Google Search Console",
          "WhatsApp contact links",
          "Email delivery provider for enquiry notifications",
          "CMS for in-house content editing (in scope dependent)",
        ],
        scopeNotes:
          "Page count, copywriting, photography and whether a CMS is included all change the scope and are agreed before development. Content migration from an existing site is quoted separately once we see what is there.",
        implementationNote:
          "Discovery and structure first, then design, then build. You review the structure before anything gets designed, and the design before anything gets built — so nothing is a surprise at handover.",
        commercialModel: "FIXED_SCOPE",
        availability: "CUSTOM_DEVELOPMENT",
        priceLabel: ESTIMATE,
        ctaLabel: "Build My Website",
        previewImage: "/projects/good-vibes-vaa-home.webp",
        previewCaption:
          "Client project — the website Aster built and deployed for Good Vibes Va’a.",
        featured: true,
        faqs: [
          {
            question: "Can you write the copy, or do I need to provide it?",
            answer:
              "Either. We can work from copy you provide, or write it from a discovery session and your existing material. Copywriting is a defined part of the scope, so it is priced rather than assumed.",
          },
          {
            question: "Will I be able to edit the site myself afterwards?",
            answer:
              "Only if a CMS or content editing layer is included in the scope. It is a common addition and we will tell you what it costs up front, because building for editability is more work than building fixed pages.",
          },
          {
            question: "Do you handle the domain and hosting?",
            answer:
              "Yes. Deployment, domain configuration and SSL are part of delivery. Ongoing hosting and maintenance can be handled by us under a maintenance agreement, or handed over to you entirely.",
          },
        ],
      },
      {
        title: "Landing Page Development",
        slug: "landing-page-development",
        icon: "Target",
        description:
          "A single conversion-focused page for one campaign, product or offer — structured and written to produce one specific action.",
        outcome: "One page, one goal, measurable results.",
        headline: "A page built to convert one audience into one action.",
        problem:
          "Campaign traffic sent to a general homepage converts badly: visitors arrive with a specific intent and get a general menu. Without a focused page and tracking in place, you also cannot tell which spend worked.",
        idealCustomer:
          "Businesses running paid campaigns, launching a product, or collecting leads for a specific service, who need a page that performs and reports.",
        capabilities: [
          "Conversion-oriented page structure and narrative order",
          "Strategic copywriting focused on one audience and one action",
          "Lead capture with validation and reliable persistence",
          "Analytics and conversion tracking configured from day one",
          "Performance optimisation so the page loads fast on mobile data",
        ],
        functionality: [
          "Message hierarchy built around a single call to action",
          "Lead capture form with validation, error states and a success state",
          "CTA placement and repetition tuned to page length rather than scattered",
          "Event and conversion tracking so campaign spend can be evaluated",
          "CRM or email platform integration so leads arrive where your team works",
          "Image and font optimisation, measured against Core Web Vitals",
        ],
        useCases: [
          "A paid traffic campaign that needs a dedicated destination",
          "A product or service launch with a waiting list",
          "Lead generation for a specific high-value service",
          "An event or intake period with a registration deadline",
        ],
        integrations: [
          "GA4 and conversion events",
          "Meta and Google advertising pixels",
          "Email marketing platforms",
          "CRM lead capture (including an Aster-built CRM)",
        ],
        scopeNotes:
          "A single page with one form is a fixed scope. A/B variants, multi-step forms, or a set of pages for several campaigns are additional and quoted on top.",
        implementationNote:
          "We agree the single conversion goal before writing anything, because the structure follows from it. Tracking is configured and verified before launch, not after the campaign starts.",
        commercialModel: "FIXED_SCOPE",
        availability: "CUSTOM_DEVELOPMENT",
        priceLabel: ESTIMATE,
        ctaLabel: "Create My Landing Page",
        featured: true,
        faqs: [
          {
            question: "How is this different from a page on my website?",
            answer:
              "A landing page removes navigation and competing options so there is one path. It is built for a specific audience arriving with a specific intent, which a general website page cannot do well.",
          },
          {
            question: "Can you set up the ad tracking too?",
            answer:
              "Yes. Analytics, conversion events and advertising pixels are configured and tested as part of delivery. Running and optimising the campaigns themselves is not something the studio does.",
          },
        ],
      },
      {
        title: "E-commerce Development",
        slug: "ecommerce-development",
        icon: "ShoppingCart",
        description:
          "An online store built around how your products are actually browsed and bought, with real order and catalogue administration behind it.",
        outcome: "Customers browse, buy, and pay without you handling each sale by hand.",
        headline: "A store your customers can buy from and your team can run.",
        problem:
          "Selling through direct messages does not scale: prices get repeated by hand, stock gets double-sold, and orders live in a conversation. A storefront without real administration behind it just moves the problem.",
        idealCustomer:
          "Businesses with a defined product range that are selling through messages or a marketplace and need their own storefront and order management.",
        capabilities: [
          "Product catalogue with categories, variants and real imagery",
          "Cart and checkout built for completion rather than decoration",
          "Payment provider integration with verified confirmation handling",
          "Order management and product administration for your team",
          "Responsive storefront built mobile-first",
        ],
        functionality: [
          "Product records with variants, pricing, descriptions and image galleries",
          "Category and collection structure for browsing and filtering",
          "Shopping cart with persistence across sessions",
          "Checkout flow integrated with a payment provider, including failure handling",
          "Order list and order detail views for fulfilment",
          "Inventory tracking and low-stock visibility, when included in scope",
          "Customer notification emails for confirmation and status changes",
        ],
        useCases: [
          "A maker or small brand moving off direct-message selling",
          "A retailer that needs its own storefront alongside a marketplace",
          "A business with product variants that a generic store handles badly",
          "A catalogue that needs to be browsable without a purchase flow at first",
        ],
        integrations: [
          "Payment providers, including Stripe",
          "Pix and local payment methods, through a supporting provider",
          "Transactional email for order notifications",
          "Analytics and e-commerce conversion tracking",
          "Shipping and logistics providers, when scoped",
        ],
        scopeNotes:
          "Catalogue size, number of variants, payment methods and whether inventory management is included all affect scope. Which payment methods are available depends on your provider and the country you operate in — we confirm that in discovery rather than promising it in advance.",
        implementationNote:
          "The catalogue model gets designed first, because everything else depends on it. Payment integration is built against the provider's test environment and verified end to end before launch.",
        commercialModel: "SETUP_PLUS_MAINTENANCE",
        availability: "CUSTOM_DEVELOPMENT",
        priceLabel: ESTIMATE,
        ctaLabel: "Build My Online Store",
        previewImage: "/projects/fulo-crochet-home.webp",
        previewCaption: "Client project — the storefront Aster built for Fulô Crochet.",
        featured: true,
        faqs: [
          {
            question: "Which payment methods can you support?",
            answer:
              "Whatever your payment provider supports in your country. Card payments are standard; Pix and local methods depend on the provider you use. We confirm what is actually available for your account during discovery.",
          },
          {
            question: "Can I manage products myself?",
            answer:
              "Yes. Product and order administration is part of the build — your team adds products, edits pricing and processes orders without a developer.",
          },
          {
            question: "Why setup plus maintenance rather than a fixed price?",
            answer:
              "A store depends on hosting, a payment integration and transactional email, all of which carry running costs and need monitoring. The build is quoted once; the recurring fee covers keeping it operational.",
          },
        ],
      },
      {
        title: "Web Application Development",
        slug: "web-application-development",
        icon: "AppWindow",
        description:
          "An interactive application for a specific business or customer need — accounts, data, and logic rather than pages of content.",
        outcome: "A product your customers log into and use, not a brochure.",
        headline: "When a website is not enough and software is the product.",
        problem:
          "Some needs cannot be met by pages: customers need accounts, their own data, and a workflow of their own. Forcing that into a website or a spreadsheet creates manual work for someone on your side forever.",
        idealCustomer:
          "Businesses whose offering is itself interactive — portals, memberships, platforms — or who need a tool their customers use directly.",
        capabilities: [
          "User accounts, authentication and permissions",
          "Application logic designed around your actual process",
          "Data models built to be queried and extended",
          "Interfaces designed for repeated daily use",
          "Deployment, environments and monitoring",
        ],
        functionality: [
          "Authentication, sessions and role-based access",
          "Customer-facing views scoped to each user's own data",
          "Administrative views for your team to support and intervene",
          "Business rules enforced on the server rather than trusted to the browser",
          "Notification and email flows tied to application events",
          "API endpoints where other systems need to read or write",
        ],
        useCases: [
          "A customer portal where clients see their own records and documents",
          "A membership or subscription platform with gated content",
          "A booking application with availability logic of its own",
          "An educational platform with progress tracking",
          "An interactive internal tool exposed to selected customers",
        ],
        integrations: [
          "Payment and subscription providers",
          "Email and notification delivery",
          "Third-party APIs specific to your sector",
          "Single sign-on, when required",
        ],
        scopeNotes:
          "Scope depends entirely on the feature set, which is why this is quoted rather than priced. We normally recommend defining a first release that solves one workflow completely, then extending it, instead of building everything at once.",
        implementationNote:
          "Discovery produces a written feature list and a data model before any interface work. The first release is deliberately narrow so it reaches real users early and the rest gets built against actual feedback.",
        commercialModel: "CUSTOM_QUOTE",
        availability: "CUSTOM_DEVELOPMENT",
        priceLabel: ESTIMATE,
        ctaLabel: "Develop My Application",
        faqs: [
          {
            question: "How do I know what this will cost before scoping it?",
            answer:
              "You do not, and we will not pretend otherwise. Discovery produces a written scope and a quote. If the budget does not fit, we reduce the first release rather than quietly cutting quality.",
          },
          {
            question: "Can we start small and expand?",
            answer:
              "That is the recommended path. We build the architecture so later phases are additions rather than a rewrite, and the first release targets one complete workflow.",
          },
        ],
      },
    ],
  },
  {
    code: "02",
    name: "Business Software",
    slug: "business-software",
    icon: "LayoutDashboard",
    tagline: "The systems your team works in every day.",
    description:
      "Purpose-built software that gives businesses more control over their daily operations.",
    solutions: [
      {
        title: "CRM & Client Management",
        slug: "crm-client-management",
        icon: "Users",
        description:
          "A customer relationship system shaped around your sales process, instead of a generic CRM you have to bend your process to fit.",
        outcome: "Every customer, conversation and follow-up in one place.",
        headline: "Stop losing deals in a spreadsheet and an inbox.",
        problem:
          "Customer information ends up spread across messages, notebooks and someone's memory. Follow-ups get forgotten, nobody can see the real state of the pipeline, and the knowledge leaves when the person does.",
        idealCustomer:
          "Businesses with a repeatable sales process and more leads than one person can track by memory — typically where several people touch the same customer.",
        capabilities: [
          "Customer and company records with full interaction history",
          "Lead capture and qualification",
          "A sales pipeline that matches your actual stages",
          "Follow-up tasks with owners and due dates",
          "Reporting on pipeline and conversion",
        ],
        functionality: [
          "Customer records with contacts, notes, files and a dated activity history",
          "Lead intake from your website forms, landing pages or manual entry",
          "Pipeline stages configured to your process, with movement history",
          "Task and follow-up assignment, with overdue visibility",
          "Segmentation and filtering for targeted outreach",
          "Dashboard covering pipeline value, stage distribution and conversion",
          "Role-based access so staff see what they should, when required",
        ],
        useCases: [
          "A services business tracking proposals through to signature",
          "A team handing leads between sales and delivery without losing context",
          "A business that wants website enquiries to arrive directly in the pipeline",
          "Replacing a generic CRM nobody uses because it does not match the process",
        ],
        integrations: [
          "Website and landing page forms",
          "Email notification on new leads and stage changes",
          "Calendar for scheduled follow-ups",
          "Accounting or invoicing tools, when scoped",
        ],
        scopeNotes:
          "Number of pipelines, how much automation sits inside them, and whether email or calendar sync is included drive the scope. Importing existing customer data is quoted once we have seen its current shape.",
        implementationNote:
          "We map your current process before building, including the stages people actually use rather than the ones on the org chart. Data import and a short team walkthrough are part of launch.",
        commercialModel: "CUSTOM_QUOTE",
        availability: "CUSTOM_DEVELOPMENT",
        priceLabel: ESTIMATE,
        ctaLabel: "Build My CRM",
        featured: true,
        faqs: [
          {
            question: "Why build a CRM instead of buying one?",
            answer:
              "If an off-the-shelf CRM fits your process, buy it — we will tell you so. Building makes sense when the process is unusual, when licence costs per seat become the problem, or when it has to sit inside software you already run.",
          },
          {
            question: "Can it receive leads from my website automatically?",
            answer:
              "Yes. Website and landing page forms can write straight into the pipeline, so a new enquiry arrives as a lead with its source attached rather than as an email someone has to re-type.",
          },
        ],
      },
      {
        title: "Booking & Scheduling Systems",
        slug: "booking-scheduling-systems",
        icon: "CalendarCheck",
        description:
          "A scheduling system for service businesses: customers book themselves, availability stays correct, and confirmations go out without anyone typing them.",
        outcome: "Customers book without a conversation, and the calendar stays right.",
        headline: "Give customers a better way to book. Give your business a better way to operate.",
        problem:
          "Booking by message means repeating availability all day, double-booked slots, and no-shows nobody reminded. The calendar is only correct in one person's head, and that person cannot take a day off.",
        idealCustomer:
          "Service businesses that sell time — studios, clinics, practitioners, operators and anyone whose day is a calendar with staff and capacity.",
        capabilities: [
          "A service catalogue with duration and pricing",
          "Staff and resource management",
          "Availability rules, including breaks and exceptions",
          "Customer self-service booking",
          "Automated confirmations and reminders",
        ],
        functionality: [
          "Customer-facing booking flow: pick a service, see genuine availability, confirm",
          "Availability generated from working hours, service duration, buffers and existing bookings",
          "Staff accounts with individual schedules, and per-staff service assignment",
          "Admin calendar for creating, rescheduling and cancelling appointments",
          "Cancellation and rescheduling rules, including notice windows",
          "Customer records with appointment history and notes",
          "Automated confirmation and reminder messages by email, or WhatsApp where supported",
          "Deposit or full payment at booking, where a payment provider is integrated",
        ],
        useCases: [
          "A multi-practitioner studio where each person has different hours and services",
          "A clinic that needs deposits to reduce no-shows",
          "An operator selling scheduled experiences with limited capacity",
          "A business replacing a booking inbox that one person manages manually",
        ],
        integrations: [
          "Payment providers for deposits and prepayment",
          "Transactional email for confirmations and reminders",
          "WhatsApp Business Platform for reminders, subject to approval",
          "Calendar sync for staff, when scoped",
        ],
        scopeNotes:
          "Staff count, availability complexity, deposit handling and reminder channels change the scope significantly. WhatsApp reminders require the official WhatsApp Business Platform, a verified business account and template approval — we present that as scoped work with a dependency, never as a feature that is simply switched on.",
        implementationNote:
          "Availability logic gets specified in writing first, because it is where booking systems fail. Launch includes a real booking tested end to end: slot shown, booking made, confirmation received, calendar updated.",
        commercialModel: "SETUP_PLUS_MAINTENANCE",
        availability: "CUSTOM_DEVELOPMENT",
        priceLabel: ESTIMATE,
        ctaLabel: "Build My Booking System",
        previewImage: "/projects/good-vibes-vaa-agendar.webp",
        previewCaption:
          "Client project — the live booking flow Aster built for Good Vibes Va’a.",
        featured: true,
        faqs: [
          {
            question: "Can customers pay a deposit when they book?",
            answer:
              "Yes, where a payment provider is integrated. The deposit is taken at booking and tied to the appointment, so cancellations and refunds follow the rules you set.",
          },
          {
            question: "Can reminders go out on WhatsApp?",
            answer:
              "Through the official WhatsApp Business Platform, yes — but it requires a verified business account and approved message templates, and that approval is not ours to grant. We scope it as dependent work. Email reminders have no such dependency.",
          },
          {
            question: "What happens to bookings we take by phone?",
            answer:
              "Staff create them in the admin calendar, and they consume availability exactly like self-service bookings. The calendar stays the single source of truth whichever way a booking arrives.",
          },
        ],
      },
      {
        title: "Business Operations Dashboard",
        slug: "business-operations-dashboard",
        icon: "BarChart3",
        description:
          "One screen that answers how the business is doing, built from the data you already have in several disconnected places.",
        outcome: "The numbers you run on, in one place, current.",
        headline: "Stop assembling the same report by hand every week.",
        problem:
          "The data exists, but in four systems and a spreadsheet. Producing a straight answer takes someone an afternoon, so the numbers get looked at late — and decisions get made on a feeling instead.",
        idealCustomer:
          "Owners and managers who already have data in several tools and need a reliable, current view without a manual reporting ritual.",
        capabilities: [
          "The KPIs your business actually decides on",
          "Revenue and sales reporting",
          "Customer and operational metrics",
          "Charts and exportable reports",
          "Access control by role",
        ],
        functionality: [
          "KPI tiles defined with you, not a stock set of metrics",
          "Revenue, order and sales reporting across chosen periods",
          "Customer metrics: new, returning, retention where the data supports it",
          "Operational indicators specific to how you work",
          "Charts with comparison against previous periods",
          "Data integrations pulling from the systems holding the source data",
          "Role-based access so staff see their scope and owners see everything",
          "Export for reporting that has to leave the dashboard",
        ],
        useCases: [
          "An owner replacing a weekly spreadsheet assembled by hand",
          "A manager needing per-location or per-team comparison",
          "A business whose sales, bookings and accounting data never meet",
          "A team that needs one agreed definition of each number",
        ],
        integrations: [
          "Your existing database or application",
          "Payment provider reporting",
          "Accounting and invoicing platforms",
          "Spreadsheets, as an interim source",
        ],
        scopeNotes:
          "Cost is driven by the number of data sources and how clean they are, far more than by the chart count. If a metric cannot be derived reliably from available data, we say so in discovery rather than displaying a number nobody should trust.",
        implementationNote:
          "Each metric gets a written definition before it is built, so the dashboard does not become an argument about what a number means. Sources are connected one at a time and verified against a figure you already know.",
        commercialModel: "CUSTOM_QUOTE",
        availability: "CUSTOM_DEVELOPMENT",
        priceLabel: ESTIMATE,
        ctaLabel: "Build My Dashboard",
        faqs: [
          {
            question: "Can it pull from the tools we already use?",
            answer:
              "Where those tools expose an API or a database, yes. Which of your systems can be connected is checked in discovery — some platforms restrict data access, and we would rather find that out before quoting.",
          },
          {
            question: "How current is the data?",
            answer:
              "That is a scope decision. Live queries, scheduled refreshes every few minutes, or nightly batches each carry different costs. We pick based on how fast the underlying numbers actually change.",
          },
        ],
      },
      {
        title: "Project & Workflow Management",
        slug: "project-workflow-management",
        icon: "KanbanSquare",
        description:
          "Internal software for running your processes — tasks, stages, approvals and deadlines — modelled on how your team genuinely works.",
        outcome: "Work moves through defined stages instead of chat messages.",
        headline: "A system for the process your team already follows.",
        problem:
          "Generic project tools assume a generic process. Teams with a real sequence — approvals, handoffs, compliance steps — end up tracking the important parts outside the tool, which means nobody can see the true status.",
        idealCustomer:
          "Teams with a defined internal process that off-the-shelf task apps model badly, especially where approvals or handoffs matter.",
        capabilities: [
          "Projects and tasks with your own fields",
          "Kanban and list views over the same data",
          "Deadlines, assignment and ownership",
          "Approval steps and status tracking",
          "Notifications and reporting",
        ],
        functionality: [
          "Project and task records with custom fields for your process",
          "Board, list and calendar views of the same underlying work",
          "Stage transitions with rules about what may move where",
          "Team assignment, workload visibility and ownership",
          "Approval steps with an audit trail of who approved what and when",
          "Deadline tracking with overdue and at-risk surfacing",
          "Notifications on assignment, stage change and approaching deadlines",
          "Reporting on throughput, cycle time and bottlenecks",
        ],
        useCases: [
          "An agency moving work through briefing, production, review and delivery",
          "A team with a compliance or approval gate that must be recorded",
          "An operation coordinating field and office staff on the same jobs",
          "Replacing a spreadsheet that four people edit simultaneously",
        ],
        integrations: [
          "Email and in-app notifications",
          "Calendar for deadlines and milestones",
          "File storage for attachments",
          "Your CRM, so delivery work links to the customer record",
        ],
        scopeNotes:
          "The number of distinct workflows and how much rule enforcement each needs drive scope. We usually recommend modelling one workflow completely and extending, because teams adopt one working process faster than five half-built ones.",
        implementationNote:
          "We document the current process first, including the exceptions people actually make. Those exceptions are usually where generic tools fail, so they get designed for rather than ignored.",
        commercialModel: "CUSTOM_QUOTE",
        availability: "CUSTOM_DEVELOPMENT",
        priceLabel: ESTIMATE,
        ctaLabel: "Automate My Workflow",
        faqs: [
          {
            question: "We already use a task app. Why replace it?",
            answer:
              "Often you should not. This is worth building when your process has rules a generic board cannot enforce, or when the important steps are being tracked outside the tool anyway.",
          },
          {
            question: "Can it enforce who is allowed to approve something?",
            answer:
              "Yes. Approval permissions and the audit trail are part of the model, so a stage cannot be skipped and there is a record of who moved what.",
          },
        ],
      },
      {
        title: "Inventory & Order Management",
        slug: "inventory-order-management",
        icon: "Boxes",
        description:
          "Software for products, stock and orders — so what the system says you have is what is actually on the shelf.",
        outcome: "Accurate stock, traceable movements, orders that do not get lost.",
        headline: "Know what you have, what moved, and what you owe a customer.",
        problem:
          "Stock counted in a spreadsheet drifts from reality within a week. Products get sold twice, restocking happens too late, and order status lives in whoever took the call.",
        idealCustomer:
          "Businesses holding physical stock across one or more locations, where a counting error has a direct cost.",
        capabilities: [
          "Product and variant management",
          "Stock movements with history",
          "Order management through to fulfilment",
          "Low-stock alerts",
          "Administrative interface for daily use",
        ],
        functionality: [
          "Product records with variants, SKUs, cost and sale pricing",
          "Stock levels per product and per location",
          "Movement records for every in, out and adjustment, with who and when",
          "Order management covering received, in progress and fulfilled",
          "Low-stock and reorder alerts at thresholds you set",
          "Reporting on movement, turnover and current valuation",
          "Role-based administrative access for warehouse and office staff",
        ],
        useCases: [
          "A retailer whose spreadsheet count no longer matches the shelf",
          "A maker tracking raw materials as well as finished products",
          "A business holding stock in two locations that need separate counts",
          "An operation that needs to trace where a missing item went",
        ],
        integrations: [
          "An existing or Aster-built storefront, so sales decrement stock",
          "Accounting platforms for valuation",
          "Barcode scanning hardware, when scoped",
          "Shipping providers for fulfilment",
        ],
        scopeNotes:
          "Multiple locations, barcode hardware and accounting integration each add scope. Migrating current stock data is quoted after we see its state — and an accurate opening count is your side of the work, because the system can only be as right as the number it starts from.",
        implementationNote:
          "The product and movement model is designed first, since stock accuracy depends on recording movements rather than overwriting totals. Launch includes an opening count and a reconciliation against it.",
        commercialModel: "CUSTOM_QUOTE",
        availability: "CUSTOM_DEVELOPMENT",
        priceLabel: ESTIMATE,
        ctaLabel: "Build My Management System",
        faqs: [
          {
            question: "Can it connect to our online store?",
            answer:
              "Yes — a sale in the storefront can decrement stock directly, which is the main reason to have both in one system. If your store is on a third-party platform, we check what its API allows during discovery.",
          },
          {
            question: "Do we need barcode scanners?",
            answer:
              "No, but they reduce counting errors considerably at any real volume. The system can be built for manual entry and extended to scanning later.",
          },
        ],
      },
    ],
  },
  {
    code: "03",
    name: "Automation & AI",
    slug: "automation-ai",
    icon: "Workflow",
    tagline: "The repetitive work, handled.",
    description:
      "Connect systems, eliminate repetitive tasks, and make business processes more efficient.",
    solutions: [
      {
        title: "Business Workflow Automation",
        slug: "business-workflow-automation",
        icon: "Workflow",
        description:
          "Automation of the repetitive steps between your tools, so routine work happens without someone copying data by hand.",
        outcome: "Routine steps happen on their own, in order, every time.",
        headline: "The handoffs between your tools, done without a human in the middle.",
        problem:
          "A lead arrives and someone copies it into a CRM. An order comes in and someone emails the warehouse. None of it is hard, all of it is constant, and each handoff is somewhere a step gets skipped on a busy day.",
        idealCustomer:
          "Businesses already using several tools, where staff spend meaningful time moving information between them.",
        capabilities: [
          "Automated flows triggered by real business events",
          "Data synchronisation between systems",
          "Notification and alerting",
          "Scheduled and recurring jobs",
          "Error handling with visibility when something fails",
        ],
        functionality: [
          "Form submission routed into your CRM with its source attached",
          "New-lead notifications to the right person or channel immediately",
          "Appointment confirmation and reminder sequences",
          "Customer follow-up triggered a set period after an event",
          "Order processing steps chained without manual handoff",
          "Internal notifications on thresholds and exceptions",
          "Two-way data synchronisation where both systems must agree",
          "Failure logging and alerting, so a broken automation is noticed",
        ],
        useCases: [
          "Website enquiries reaching the CRM and the sales channel instantly",
          "Automatic follow-up on a quote that has had no response",
          "Daily synchronisation between an operational tool and accounting",
          "Alerting a manager when a metric crosses a threshold",
        ],
        integrations: [
          "CRM platforms, including an Aster-built CRM",
          "Email and messaging channels",
          "Payment providers",
          "Spreadsheets and internal databases",
          "Most tools exposing an API or webhooks",
        ],
        scopeNotes:
          "Each automation is scoped individually: the trigger, the steps, and what should happen on failure. Whether a given tool can be automated depends on the API it exposes, which we verify before quoting instead of assuming.",
        implementationNote:
          "Automations are built one at a time, starting with the highest-volume manual step. Each one gets an error path and logging, because a silent automation that stops working is worse than the manual process it replaced.",
        commercialModel: "SETUP_PLUS_MAINTENANCE",
        availability: "CUSTOM_DEVELOPMENT",
        priceLabel: ESTIMATE,
        ctaLabel: "Automate My Business",
        featured: true,
        faqs: [
          {
            question: "What if one of my tools has no API?",
            answer:
              "Then that step cannot be reliably automated, and we will say so rather than build something fragile. Often an adjacent step can be automated instead, which captures most of the saving.",
          },
          {
            question: "How do I know an automation is still working?",
            answer:
              "Every flow logs its runs and alerts on failure. That monitoring is the main reason this carries a recurring fee — an unwatched automation is a liability.",
          },
        ],
      },
      {
        title: "WhatsApp Business Automation",
        slug: "whatsapp-business-automation",
        icon: "MessageCircle",
        description:
          "Customer communication workflows on WhatsApp — with a clear line drawn between a simple contact link and the official Business Platform.",
        outcome: "Customers get answers and reminders without you typing each one.",
        headline: "Automated WhatsApp communication, with the requirements stated plainly.",
        problem:
          "WhatsApp is where customers actually are, and answering each one by hand does not scale. Most providers gloss over what automation genuinely requires, so businesses buy something that cannot be switched on.",
        idealCustomer:
          "Businesses whose customers contact them primarily on WhatsApp and who are repeating the same answers and confirmations all day.",
        capabilities: [
          "Contact links with a pre-written message — no approval required",
          "Automated responses and FAQ flows on the official platform",
          "Lead qualification before a human joins",
          "Appointment confirmations and reminders",
          "CRM synchronisation of conversations and leads",
        ],
        functionality: [
          "WhatsApp contact buttons and deep links from your site, with the service identified",
          "Automated replies to common questions through the Business Platform",
          "Qualification sequences that collect what you need before handover",
          "Appointment confirmation and reminder messages using approved templates",
          "Routing to the right person or team, with human escalation always available",
          "Lead and conversation records written into your CRM",
        ],
        useCases: [
          "A business repeating the same pricing and hours answers dozens of times a day",
          "Appointment reminders for a schedule with frequent no-shows",
          "Qualifying enquiries so sales only handles real prospects",
          "After-hours acknowledgement with a clear response expectation",
        ],
        integrations: [
          "WhatsApp Business Platform, through an approved provider",
          "CRM for lead and conversation records",
          "Booking or scheduling systems for reminders",
          "Internal notification channels for escalation",
        ],
        scopeNotes:
          "This is the distinction that matters: a WhatsApp contact link is simple and we implement it in any project. Automated messaging requires the official WhatsApp Business Platform, a verified business account, an approved provider and approved message templates — none of which the studio can grant on your behalf. We build the integration and guide the application, but approval timing sits with Meta and your provider. Anything beyond a contact link is scoped as dependent work.",
        implementationNote:
          "We start by confirming which tier you qualify for, because it determines what can be built at all. Contact links ship immediately; platform automation begins once your account and templates are approved.",
        commercialModel: "SETUP_PLUS_MAINTENANCE",
        availability: "CUSTOM_DEVELOPMENT",
        priceLabel: ESTIMATE,
        ctaLabel: "Automate My WhatsApp",
        faqs: [
          {
            question: "Can you automate my existing personal WhatsApp?",
            answer:
              "No. Automation requires the official WhatsApp Business Platform, which is a different product from the consumer or Business app. Anyone promising automation on a normal number is describing something unsupported that risks the number being blocked.",
          },
          {
            question: "How long does approval take?",
            answer:
              "That is not ours to promise — it depends on Meta and your provider. We build and test the integration while it is pending, so there is no waiting once approval lands.",
          },
          {
            question: "Will customers be stuck talking to a bot?",
            answer:
              "No. Human escalation is a required part of every flow we build. Automation handles the repetitive opening, not the whole relationship.",
          },
        ],
      },
      {
        title: "API & System Integrations",
        slug: "api-system-integrations",
        icon: "Plug",
        description:
          "Connecting software that was never designed to talk to each other, so data stops being re-entered by hand.",
        outcome: "Your systems share data instead of being bridged by a person.",
        headline: "Make the software you already pay for work together.",
        problem:
          "Each tool holds part of the picture and none of them agree. Someone re-enters the same record in three places, the copies drift, and nobody trusts any of them.",
        idealCustomer:
          "Businesses running several systems that must share data, or needing to expose their own data to a partner or application.",
        capabilities: [
          "REST API design and development",
          "Webhook producers and consumers",
          "Scheduled and real-time data synchronisation",
          "Third-party platform integration",
          "Authentication and access control for exposed endpoints",
        ],
        functionality: [
          "REST APIs over your existing data, with documentation",
          "Webhook endpoints to receive events from external platforms",
          "Outbound webhooks so partners can react to your events",
          "Synchronisation jobs with conflict handling where both sides can change",
          "Payment, CRM and ERP integrations",
          "Retry logic, failure alerting and an audit trail of what was exchanged",
          "API key or token authentication with scoped permissions",
        ],
        useCases: [
          "An online store that must push orders into accounting",
          "A CRM that needs customer data from an internal database",
          "Exposing an API so a partner can submit orders directly",
          "Replacing a nightly manual export with a real synchronisation",
        ],
        integrations: [
          "Payment providers, including Stripe",
          "CRM and ERP platforms",
          "Accounting and invoicing systems",
          "Any platform with a documented API or webhooks",
        ],
        scopeNotes:
          "Scope depends on what the other system permits, which is the honest constraint in all integration work. Some platforms expose little, rate-limit heavily, or require partner approval. We verify the API against your actual account before quoting, rather than against the documentation alone.",
        implementationNote:
          "We confirm access and read the real API responses first — documentation and behaviour differ more often than vendors admit. Integrations ship with retry handling and alerting, because an external system will eventually be unavailable.",
        commercialModel: "FIXED_SCOPE",
        availability: "CUSTOM_DEVELOPMENT",
        priceLabel: ESTIMATE,
        ctaLabel: "Connect My Systems",
        faqs: [
          {
            question: "What if the platform does not allow the access we need?",
            answer:
              "We find that out before quoting, and tell you. Sometimes there is a supported alternative; sometimes the honest answer is that the integration is not possible as specified.",
          },
          {
            question: "What happens when the other system goes down?",
            answer:
              "Integrations are built with retries and failure alerting, so work queues rather than disappears, and someone knows it happened.",
          },
        ],
      },
      {
        title: "AI Business Agents",
        slug: "ai-business-agents",
        icon: "Bot",
        description:
          "AI-assisted tools scoped to one defined business task, with explicit data access, permissions and a human escalation path.",
        outcome: "A narrow assistant that genuinely helps, with defined limits.",
        headline: "AI applied to one task, with the constraints written down.",
        problem:
          "Most AI offerings are a general chat window bolted onto a business and asked to be useful. Without a defined task, defined data access and a human fallback, it produces confident wrong answers in front of your customers.",
        idealCustomer:
          "Businesses with a repetitive, language-heavy task — answering the same questions, classifying incoming requests, extracting data from documents — and realistic expectations.",
        capabilities: [
          "Customer support assistants over your own content",
          "Internal knowledge retrieval for staff",
          "Lead classification and routing",
          "Document processing and data extraction",
          "Human escalation as a required part of every flow",
        ],
        functionality: [
          "Retrieval over your documented material, so answers cite your content",
          "Scoped data access defined per agent and enforced server-side",
          "Permission boundaries covering what the agent may read and do",
          "Escalation to a person on low confidence or on request",
          "Classification and routing of incoming requests",
          "Document extraction into structured fields for review",
          "Logging of every interaction, for correcting behaviour",
        ],
        useCases: [
          "Answering repeat pre-sales questions from your own documentation",
          "Helping staff find an answer in internal material quickly",
          "Classifying and routing inbound enquiries by topic and urgency",
          "Extracting fields from invoices or forms into a reviewable queue",
        ],
        integrations: [
          "Model providers via API, including Anthropic and OpenAI",
          "Your existing knowledge base or documentation",
          "CRM for classification results",
          "Notification channels for escalation",
        ],
        scopeNotes:
          "Every implementation defines six things before development: the task, the data the agent may access, its permissions, the human escalation path, the external APIs required, and the expected usage and operating cost. Model API usage is a recurring third-party cost billed on consumption — it is yours, it is not fixed, and we estimate it from your expected volume rather than hiding it. We do not build an agent whose scope cannot be stated in a sentence.",
        implementationNote:
          "We start from the narrowest useful version and measure it against real examples before widening scope. Anything customer-facing launches with escalation and logging from day one.",
        commercialModel: "SETUP_PLUS_MAINTENANCE",
        availability: "CUSTOM_DEVELOPMENT",
        priceLabel: ESTIMATE,
        ctaLabel: "Build My AI Solution",
        faqs: [
          {
            question: "Will it make things up?",
            answer:
              "Any language model can. That is why we scope agents narrowly, ground answers in your own content, and require a human escalation path. We would rather it says it does not know than invents an answer for a customer.",
          },
          {
            question: "What does it cost to run?",
            answer:
              "Model API usage is billed on consumption, so it scales with volume. We estimate it from your expected usage during scoping and tell you the assumptions, because it is a real recurring cost and not a rounding error.",
          },
          {
            question: "Can it access our customer data?",
            answer:
              "Only what you explicitly grant, and that boundary is enforced in the application rather than requested in a prompt. Data access is defined and documented per agent before it is built.",
          },
        ],
      },
    ],
  },
  {
    code: "04",
    name: "Custom Software Development",
    slug: "custom-software-development",
    icon: "Code2",
    tagline: "When nothing off the shelf fits.",
    description: "Software engineered around the way your business actually works.",
    solutions: [
      {
        title: "Custom Business Software",
        slug: "custom-business-software",
        icon: "Code2",
        description:
          "An application built for a specific operational problem, when the available products all require you to work the wrong way.",
        outcome: "Software that matches your process instead of replacing it.",
        headline: "Built for how your business works, not how a product assumes it does.",
        problem:
          "You have evaluated the available tools and each one needs your process bent to fit. The result is a subscription nobody uses properly plus the spreadsheet where the real work still happens.",
        idealCustomer:
          "Businesses with a process that is genuinely specific — a particular sector, an unusual model, or a workflow that is itself the competitive advantage.",
        capabilities: [
          "Requirements and data modelling from your real process",
          "Internal management systems",
          "Customer and partner portals",
          "Administrative platforms",
          "Sector-specific software",
        ],
        functionality: [
          "Data model designed around your entities and their real relationships",
          "Role-based access for the different people who touch the process",
          "Business rules enforced in the application, not left to discipline",
          "Administrative interfaces built for daily operational use",
          "Reporting over your own structured data",
          "APIs where other systems must read or write",
          "Deployment, environments, backups and monitoring",
        ],
        useCases: [
          "An operation coordinating a process no product models correctly",
          "A business whose spreadsheet has become critical infrastructure",
          "A portal giving customers or partners controlled access to their data",
          "Software for a sector too small for anyone to have built a product for",
        ],
        integrations: [
          "Payment providers",
          "Accounting platforms",
          "Email and messaging",
          "Any existing system with an accessible API",
        ],
        scopeNotes:
          "Quoted after discovery, because the feature set is the scope. We will also tell you when an existing product would serve you better — a smaller honest recommendation is worth more than a project that should not have been built.",
        implementationNote:
          "Discovery produces a written requirements document and data model you approve before development. Delivery is phased, so you see working software early rather than at the end.",
        commercialModel: "CUSTOM_QUOTE",
        availability: "CUSTOM_DEVELOPMENT",
        priceLabel: ESTIMATE,
        ctaLabel: "Discuss a Custom Project",
        faqs: [
          {
            question: "How do you decide between building and buying?",
            answer:
              "We look at whether an existing product covers the process without distorting it, and at the real cost over a few years including licences. If buying wins, we say so.",
          },
          {
            question: "Who owns the software?",
            answer:
              "You do. Ownership and handover of the codebase are stated in the agreement before work starts.",
          },
        ],
      },
      {
        title: "MVP Development",
        slug: "mvp-development",
        icon: "Rocket",
        description:
          "Turning an idea into a working first product — narrow enough to ship, real enough to put in front of users.",
        outcome: "A working product in real users' hands, not a prototype.",
        headline: "The smallest version that proves the idea works.",
        problem:
          "First products fail by trying to launch complete. Budget goes into features nobody validated, the launch slips, and the first real feedback arrives after the money is spent.",
        idealCustomer:
          "Founders and businesses launching a new product or entering a new market, who need something real in front of users quickly.",
        capabilities: [
          "Discovery and scope definition",
          "Requirements and technical architecture",
          "UX and interface design",
          "Development and testing",
          "Deployment and launch",
        ],
        functionality: [
          "Discovery translating the idea into a defined core workflow",
          "Ruthless scoping: what ships first, what explicitly waits",
          "Technical architecture chosen for iteration speed and sane running cost",
          "Interface design covering the real flow, not only the happy path",
          "Development of the core product with accounts and data",
          "Testing of critical journeys before launch",
          "Deployment with environments, monitoring and error reporting",
          "A written view of what phase two would add",
        ],
        useCases: [
          "A founder validating a product idea with real users",
          "An established business testing a new line without betting the budget",
          "Replacing an unscalable manual service with a product",
          "Building something concrete enough to show investors or early customers",
        ],
        integrations: [
          "Payment and subscription providers",
          "Authentication providers",
          "Email and notifications",
          "Analytics for actual usage",
        ],
        scopeNotes:
          "The defining constraint is what gets left out. We scope one complete core workflow and write down what phase two holds — an MVP that tries to be complete is not an MVP, and it is the most common way this work goes wrong.",
        implementationNote:
          "Scope gets cut before development, not during. The architecture assumes the product will change, because the point of shipping early is to learn something that changes it.",
        commercialModel: "CUSTOM_QUOTE",
        availability: "CUSTOM_DEVELOPMENT",
        priceLabel: ESTIMATE,
        ctaLabel: "Discuss a Custom Project",
        faqs: [
          {
            question: "How long does an MVP take?",
            answer:
              "It depends entirely on the core workflow, and we will not quote a number before scoping one. What we can commit to is phasing the build so you see working software well before the end.",
          },
          {
            question: "What if the idea needs to change after launch?",
            answer:
              "That is the expected outcome. The architecture is chosen so changes are additions rather than a rewrite, and phase two is planned from what real usage shows.",
          },
        ],
      },
      {
        title: "System Modernization",
        slug: "system-modernization",
        icon: "RefreshCw",
        description:
          "Improving, extending or rebuilding software you already depend on — without stopping the business that runs on it.",
        outcome: "The system you rely on becomes maintainable again.",
        headline: "Fix what the business runs on without turning it off.",
        problem:
          "The system works, barely. It is slow, nobody wants to touch it, the person who wrote it has gone, and every change risks something unrelated breaking. Replacing it wholesale is too risky, so nothing happens.",
        idealCustomer:
          "Businesses dependent on existing software that has become slow, fragile or unmaintainable, where downtime is not acceptable.",
        capabilities: [
          "Assessment of the existing system",
          "Frontend redesign and rebuild",
          "Backend and database improvement",
          "API development over legacy data",
          "Phased migration planning",
        ],
        functionality: [
          "Technical assessment of the current codebase, data and infrastructure",
          "Performance work targeting measured bottlenecks rather than guesses",
          "Database optimisation: indexing, query and schema improvement",
          "Frontend rebuild over the existing backend, where that is the sensible order",
          "APIs exposed over legacy data so new software can be built alongside",
          "Incremental migration, replacing one component at a time",
          "Test coverage added around what must not break",
        ],
        useCases: [
          "An internal system too slow for the volume it now handles",
          "Software whose original developer is unavailable",
          "A legacy application needing a modern interface but a working backend",
          "A business needing to build new features against old data",
        ],
        integrations: [
          "Existing databases and data stores",
          "Current authentication systems",
          "Whatever the legacy system already integrates with",
        ],
        scopeNotes:
          "Work starts with a paid assessment, because quoting modernisation without reading the code is guesswork. The assessment produces findings and a phased plan — and it is deliberately a separate, smaller commitment than the work it recommends.",
        implementationNote:
          "Nothing gets replaced before it is understood and covered by tests. Migration is incremental and reversible, so the business keeps running throughout.",
        commercialModel: "CUSTOM_QUOTE",
        availability: "CUSTOM_DEVELOPMENT",
        priceLabel: ESTIMATE,
        ctaLabel: "Discuss a Custom Project",
        faqs: [
          {
            question: "Can you work on a system you did not build?",
            answer:
              "Yes, and that is most of this work. It starts with an assessment so both sides understand the state of things before committing to a plan.",
          },
          {
            question: "Rebuild or improve what we have?",
            answer:
              "Usually improve, then replace in parts. Full rewrites carry the highest risk and are recommended only when the assessment shows the existing foundation genuinely cannot be extended.",
          },
        ],
      },
    ],
  },
];

/** Dúvidas da home — objeção comercial real, resposta honesta. */
export const homeFaq: CatalogFaq[] = [
  {
    question: "What types of projects does Aster develop?",
    answer:
      "Websites, landing pages, online stores and web applications; business software such as CRMs, booking systems, dashboards, workflow tools and inventory management; workflow automation, API integrations and scoped AI tooling; and fully custom software, MVPs and modernisation of systems you already run.",
  },
  {
    question: "How much does a project cost?",
    answer:
      "It depends on the scope, and the commercial model depends on the type of work — fixed-scope for defined deliverables, a custom quote for software, setup plus maintenance where something has to be hosted and monitored. We do not publish prices we cannot stand behind. Tell us what you need and you get a written estimate.",
  },
  {
    question: "Do you build custom software?",
    answer:
      "Yes, and it is a large part of the studio's work. We will also tell you when an existing product would serve you better than something built from scratch.",
  },
  {
    question: "Can you improve an existing website or application?",
    answer:
      "Yes. That starts with a technical assessment of what is there, which produces findings and a phased plan. Quoting improvement work without reading the code would be guesswork.",
  },
  {
    question: "Can you integrate third-party systems?",
    answer:
      "Where the other platform allows it. We verify the API against your actual account before quoting, because documentation and real behaviour often differ. If an integration is not possible as specified, you will hear that rather than a workaround that breaks later.",
  },
  {
    question: "How long does development take?",
    answer:
      "A single landing page and a custom platform are not comparable, so we do not advertise one timeline. The schedule comes out of scoping, in writing, before development starts.",
  },
  {
    question: "Do you provide maintenance?",
    answer:
      "Yes, as a defined agreement covering hosting, monitoring, support and improvements. It is optional and priced separately from the build — and for anything with integrations or automation, we recommend it.",
  },
  {
    question: "Can I start with a small project and expand later?",
    answer:
      "Yes, and it is usually the better approach. Projects are architected so the next phase is an addition rather than a rewrite, which means starting narrow costs you nothing in the long run.",
  },
];
