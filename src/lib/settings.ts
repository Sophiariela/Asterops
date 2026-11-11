import { cache } from "react";

import { prisma } from "@/lib/prisma";

export const getSiteSettings = cache(async () => {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  return (
    settings ?? {
      id: "default",
      studioName: "Aster",
      contactEmail: "contact@aster.studio",
      whatsapp: null,
      instagramUrl: null,
      ctaLabel: "Start a Project",
      ctaHref: "/contact",
      footerNote: "Digital solutions built around your business.",
      updatedAt: new Date(),
    }
  );
});
