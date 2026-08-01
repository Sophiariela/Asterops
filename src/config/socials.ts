import type { SocialLink } from "@/types";

export const contactEmail = "contact@aster.studio";
export const instagramHandle = "@aster.ops";
export const instagramUrl = "https://instagram.com/aster.ops";

export const socials: SocialLink[] = [
  {
    label: "Instagram",
    href: instagramUrl,
    icon: "instagram",
  },
  {
    label: "Contact",
    href: `mailto:${contactEmail}`,
    icon: "mail",
  },
];
