import type { Metadata } from "next";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { ServiceCard } from "@/components/services/service-card";
import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description: `Website development, e-commerce, custom software, dashboards, and automation — the services ${siteConfig.name} builds for businesses and entrepreneurs.`,
  path: "/services",
});

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <section className="px-6 pb-24 pt-28 sm:pt-36">
      <div className="mx-auto max-w-container">
        <SectionHeading
          eyebrow="Services"
          title="What we build."
          description="Each service is scoped around your business — you tell us what you need, we design and develop it."
          align="center"
          className="mx-auto items-center text-center"
        />

        {services.length === 0 ? (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            Services are being updated — please check back shortly, or reach out directly.
          </p>
        ) : (
          <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <RevealItem key={service.id}>
                <ServiceCard service={service} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
