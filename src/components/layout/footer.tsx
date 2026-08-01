import Link from "next/link";
import { Instagram, Linkedin, Mail, Twitter } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { footerColumns } from "@/config/navigation";
import { socials } from "@/config/socials";
import { siteConfig } from "@/config/site";
import type { SocialLink } from "@/types";

const socialIcons: Record<SocialLink["icon"], typeof Instagram> = {
  instagram: Instagram,
  mail: Mail,
  linkedin: Linkedin,
  twitter: Twitter,
};

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-container px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2 flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline}
            </p>
            <div className="mt-2 flex items-center gap-3">
              {socials.map((social) => {
                const Icon = socialIcons[social.icon];
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                    aria-label={social.label}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {column.title}
              </span>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => {
                  const isExternal = link.href.startsWith("http") || link.href.startsWith("mailto:");
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <p className="font-mono uppercase tracking-[0.2em]">{siteConfig.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
