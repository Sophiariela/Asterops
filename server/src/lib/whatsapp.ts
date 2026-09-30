// Premium feature, scaffolded ahead of a Meta WhatsApp Business (Cloud
// API) account being connected. WHATSAPP_PHONE_NUMBER_ID identifies the
// Meta-registered sending number; the recipient is each site's own
// whatsappNumber (Business Settings), which is how "custom WhatsApp
// number" support works — one sender, one recipient per site.
const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

export const whatsappConfigured = Boolean(accessToken && phoneNumberId);

export async function sendWhatsAppMessage(to: string, body: string): Promise<{ sent: boolean }> {
  if (!whatsappConfigured) {
    console.log(`[whatsapp:not-configured] to=${to} body="${body}"`);
    return { sent: false };
  }
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body },
      }),
    });
    if (!res.ok) throw new Error(`WhatsApp Cloud API responded ${res.status}`);
    return { sent: true };
  } catch (err) {
    console.error(`[whatsapp:send-failed] to=${to}`, err);
    return { sent: false };
  }
}
