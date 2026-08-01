import type { Metadata } from "next";

import { LegalSection } from "@/components/legal/legal-section";
import { siteConfig } from "@/config/site";
import { contactEmail } from "@/config/socials";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: `The terms that govern use of ${siteConfig.name} products and services.`,
  path: "/legal/terms",
});

const LAST_UPDATED = "January 1, 2026";

export default function TermsPage() {
  return (
    <section className="px-6 pb-24 pt-28 sm:pt-36">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-4 pb-12">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-accent">Legal</span>
          <h1 className="text-4xl font-medium tracking-tight text-foreground">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <LegalSection title="1. Acceptance of Terms">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of {siteConfig.name} products,
            websites and services (collectively, the &quot;Services&quot;), provided by {siteConfig.legalName}. By
            accessing or using the Services, you agree to be bound by these Terms.
          </p>
        </LegalSection>

        <LegalSection title="2. Description of Service">
          <p>
            Aster provides intelligent digital systems — including websites, commerce, AI automation and
            business intelligence — configured and operated for business use. Specific features, pricing and
            availability vary by product and plan.
          </p>
        </LegalSection>

        <LegalSection title="3. Accounts & Access">
          <p>
            You are responsible for maintaining the confidentiality of any account credentials and for all
            activity that occurs under your account. Notify us immediately of any unauthorized use.
          </p>
        </LegalSection>

        <LegalSection title="4. Acceptable Use">
          <p>You agree not to use the Services to:</p>
          <ul>
            <li>Violate any applicable law or regulation.</li>
            <li>Infringe the intellectual property or other rights of any third party.</li>
            <li>Transmit malware, spam, or engage in fraudulent or deceptive practices.</li>
            <li>Attempt to gain unauthorized access to our systems or other users&apos; data.</li>
          </ul>
        </LegalSection>

        <LegalSection title="5. Payment & Billing">
          <p>
            Paid plans are billed according to the pricing and terms presented at signup or in your service
            agreement. Fees are non-refundable except as required by law or expressly stated otherwise.
          </p>
        </LegalSection>

        <LegalSection title="6. Intellectual Property">
          <p>
            Aster and its licensors retain all rights, title and interest in the underlying systems,
            software and platform. You retain ownership of the content and data you provide, and grant us a
            license to use it solely to provide the Services.
          </p>
        </LegalSection>

        <LegalSection title="7. Termination">
          <p>
            Either party may terminate service as set out in the applicable service agreement. We may suspend or
            terminate access if these Terms are violated or use poses a security or legal risk.
          </p>
        </LegalSection>

        <LegalSection title="8. Disclaimers">
          <p>
            The Services are provided &quot;as is&quot; without warranties of any kind, express or implied, except as
            expressly set out in a signed service agreement.
          </p>
        </LegalSection>

        <LegalSection title="9. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, {siteConfig.name} will not be liable for indirect,
            incidental, special or consequential damages arising from use of the Services.
          </p>
        </LegalSection>

        <LegalSection title="10. Governing Law">
          <p>
            These Terms are governed by the laws applicable in our jurisdiction of incorporation, without regard
            to conflict-of-law principles, unless otherwise specified in a signed service agreement.
          </p>
        </LegalSection>

        <LegalSection title="11. Changes to These Terms">
          <p>
            We may update these Terms from time to time. Material changes will be reflected by updating the
            &quot;Last updated&quot; date above. Continued use of the Services after changes constitutes acceptance.
          </p>
        </LegalSection>

        <LegalSection title="12. Contact Us">
          <p>
            Questions about these Terms can be sent to{" "}
            <a href={`mailto:${contactEmail}`} className="text-accent hover:underline">
              {contactEmail}
            </a>
            .
          </p>
        </LegalSection>
      </div>
    </section>
  );
}
