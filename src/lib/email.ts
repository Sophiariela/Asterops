/**
 * Notificação de novo pedido de projeto por e-mail.
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
  businessName?: string;
  phone: string;
  country: string;
  projectCategory: string;
  service?: string;
  message: string;
  budget?: string;
  timeline?: string;
  referenceUrl?: string;
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
    `New project inquiry

` +
    line("Name", payload.name) +
    line("Email", payload.email) +
    line("Phone / WhatsApp", payload.phone) +
    line("Company", payload.businessName) +
    line("Country", payload.country) +
    line("Category", payload.projectCategory) +
    line("Solution", payload.service) +
    line("Budget", payload.budget) +
    line("Timeline", payload.timeline) +
    line("Reference", payload.referenceUrl) +
    `
What they want to build:
${payload.message}
` +
    `
Open in the admin panel: /admin/inquiries/${payload.id}
`;

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
      subject: `New inquiry — ${payload.name} (${payload.projectCategory})`,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}`);
  }
}
