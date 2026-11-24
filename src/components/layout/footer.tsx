import Link from "next/link";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import type { SiteSettings } from "@prisma/client";

import { Logo } from "@/components/shared/logo";
import { toWhatsAppHref } from "@/components/shared/whatsapp-link";
import { buildFooterColumns } from "@/config/navigation";
import { siteConfig } from "@/config/site";

/** Mensagem que já vem escrita ao abrir o WhatsApp a partir do rodapé. */
const WHATSAPP_MESSAGE = "Hi! I came from the Aster website and I would like to discuss a project.";

export function Footer({ settings }: { settings: SiteSettings }) {
  const footerColumns = buildFooterColumns(settings.contactEmail);

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-container px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2 flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{settings.footerNote}</p>
            <div className="mt-2 flex items-center gap-3">
              <Link
                href={`mailto:${settings.contactEmail}`}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent-ink"
                aria-label="Send an email"
              >
                <Mail className="h-4 w-4" />
              </Link>
              {settings.whatsapp ? (
                <Link
                  href={toWhatsAppHref(settings.whatsapp, WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent-ink"
                  aria-label="Message on WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </Link>
              ) : null}
              {settings.instagramUrl ? (
                <Link
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent-ink"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
              ) : null}
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
            &copy; {new Date().getFullYear()} {siteConfig.legalName}. Todos os direitos reservados.
          </p>
          <p className="font-mono uppercase tracking-[0.2em]">{siteConfig.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
