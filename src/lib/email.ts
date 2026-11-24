/**
 * Notificação de novo pedido por e-mail.
 *
 * Opcional e desligada por padrão: só envia quando `RESEND_API_KEY`,
 * `INQUIRY_FROM_EMAIL` e `INQUIRY_NOTIFY_EMAIL` estiverem definidos no
 * ambiente. Sem isso, `isEmailConfigured()` devolve false e a rota de
 * contato simplesmente não chama o envio — o pedido continua gravado no
 * banco, que é a fonte de verdade.
 *
 * Usa a API HTTP da Resend via `fetch`, sem SDK, para não acrescentar
 * dependência a um recurso que pode nunca ser ligado.
 */
export interface InquiryEmailPayload {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  businessName?: string;
  businessType: string;
  service: string;
  message: string;
  problem?: string;
  budget?: string;
  timeline?: string;
}

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY && process.env.INQUIRY_FROM_EMAIL && process.env.INQUIRY_NOTIFY_EMAIL,
  );
}

function line(label: string, value?: string): string {
  return value ? `${label}: ${value}\n` : "";
}

export async function notifyAdminOfInquiry(payload: InquiryEmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INQUIRY_FROM_EMAIL;
  const to = process.env.INQUIRY_NOTIFY_EMAIL;
  if (!apiKey || !from || !to) return;

  const text =
    `Novo pedido de diagnóstico\n\n` +
    line("Nome", payload.name) +
    line("E-mail", payload.email) +
    line("WhatsApp", payload.whatsapp) +
    line("Negócio", payload.businessName) +
    line("Tipo", payload.businessType) +
    line("Precisa de", payload.service) +
    line("Investimento", payload.budget) +
    line("Prazo", payload.timeline) +
    `\nO que quer resolver:\n${payload.message}\n` +
    (payload.problem ? `\nO que atrapalha hoje:\n${payload.problem}\n` : "") +
    `\nAbrir no painel: /admin/inquiries/${payload.id}\n`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `Novo pedido — ${payload.name} (${payload.businessType})`,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend respondeu ${response.status}`);
  }
}
