export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "instagram" | "mail" | "linkedin" | "twitter";
}
