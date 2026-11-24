import type { Metadata } from "next";

import { LegalSection } from "@/components/legal/legal-section";
import { siteConfig } from "@/config/site";
import { getSiteSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects information.`,
  path: "/legal/privacy",
});

const LAST_UPDATED = "January 1, 2026";

export default async function PrivacyPage() {
  const { contactEmail } = await getSiteSettings();
  return (
    <section className="px-6 pb-24 pt-28 sm:pt-36">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-4 pb-12">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-accent-ink">Legal</span>
          <h1 className="text-4xl font-medium tracking-tight text-foreground">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <LegalSection title="1. Introduction">
          <p>
            {siteConfig.legalName} (&quot;Aster&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is a digital development studio. This
            Privacy Policy explains what information we collect through {siteConfig.url} and in the course of
            project inquiries and engagements, and how we use, disclose and protect it.
          </p>
        </LegalSection>

        <LegalSection title="2. Information We Collect">
          <p>We collect information in the following ways:</p>
          <ul>
            <li>Information you provide directly, such as your name, email, business name and project details when you submit a project inquiry.</li>
            <li>Project and engagement data related to work we deliver for you.</li>
            <li>Usage data collected automatically, such as pages visited, device and browser information, and approximate location.</li>
          </ul>
        </LegalSection>

        <LegalSection title="3. How We Use Information">
          <p>We use collected information to:</p>
          <ul>
            <li>Respond to project inquiries and prepare proposals.</li>
            <li>Deliver and support the projects we build for you.</li>
            <li>Communicate with you about your project and related administrative matters.</li>
            <li>Detect, prevent and address fraud, abuse and security issues.</li>
          </ul>
        </LegalSection>

        <LegalSection title="4. Cookies & Tracking">
          <p>
            We use cookies and similar technologies to operate our website, remember preferences (such as theme),
            and understand how our site is used. You can control cookies through your browser settings; disabling
            some cookies may affect site functionality.
          </p>
        </LegalSection>

        <LegalSection title="5. How We Share Information">
          <p>
            We do not sell personal information. We may share information with service providers who help us
            operate our business (e.g. hosting, analytics, email delivery), when required by law, or in
            connection with a merger, acquisition or sale of assets.
          </p>
        </LegalSection>

        <LegalSection title="6. Data Security">
          <p>
            We implement technical and organizational measures designed to protect information against
            unauthorized access, alteration, disclosure or destruction. No method of transmission or storage is
            completely secure, and we cannot guarantee absolute security.
          </p>
        </LegalSection>

        <LegalSection title="7. Your Rights">
          <p>
            Depending on your location, you may have the right to access, correct, delete, or export your
            personal information, or to object to or restrict certain processing. To exercise these rights,
            contact us at {contactEmail}.
          </p>
        </LegalSection>

        <LegalSection title="8. Children's Privacy">
          <p>
            Our services are intended for business use and are not directed at individuals under 16. We do not
            knowingly collect personal information from children.
          </p>
        </LegalSection>

        <LegalSection title="9. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Material changes will be reflected by updating
            the &quot;Last updated&quot; date above. Continued use of our services after changes constitutes acceptance of
            the updated policy.
          </p>
        </LegalSection>

        <LegalSection title="10. Contact Us">
          <p>
            Questions about this Privacy Policy can be sent to{" "}
            <a href={`mailto:${contactEmail}`} className="text-accent-ink hover:underline">
              {contactEmail}
            </a>
            .
          </p>
        </LegalSection>
      </div>
    </section>
  );
}
