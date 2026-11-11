export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}
