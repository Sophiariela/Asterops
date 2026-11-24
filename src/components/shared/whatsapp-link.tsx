import { MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/** Normaliza o número para o formato que o wa.me aceita (só dígitos). */
export function toWhatsAppHref(whatsapp: string, message: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

interface WhatsAppLinkProps {
  whatsapp: string | null;
  message: string;
  label?: string;
  className?: string;
}

/**
 * Link de WhatsApp com a mensagem já escrita.
 *
 * Renderiza nada quando o número não está cadastrado em SiteSettings —
 * é melhor não ter o botão do que ter um botão que abre conversa vazia
 * com número errado.
 */
export function WhatsAppLink({ whatsapp, message, label = "Falar no WhatsApp", className }: WhatsAppLinkProps) {
  if (!whatsapp) return null;

  return (
    <a
      href={toWhatsAppHref(whatsapp, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-secondary",
        className,
      )}
    >
      <MessageCircle className="h-4 w-4 text-accent-ink" aria-hidden />
      {label}
    </a>
  );
}
