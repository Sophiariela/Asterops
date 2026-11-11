import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { ServiceCard } from "@/components/services/service-card";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/config/content";
import { prisma } from "@/lib/prisma";

export async function ServicesPreview() {
  const { servicesPreview } = homeContent;
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    take: 6,
  });

  if (services.length === 0) return null;

  return (
    <section className="border-t border-border/60 px-6 py-24">
      <div className="mx-auto max-w-container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={servicesPreview.eyebrow}
            title={servicesPreview.title}
            description={servicesPreview.description}
          />
          <Button asChild variant="outline" className="w-fit">
            <Link href="/services">
              View all services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <RevealItem key={service.id}>
              <ServiceCard service={service} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
