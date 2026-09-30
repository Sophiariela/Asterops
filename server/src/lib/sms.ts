// Premium feature, scaffolded ahead of a Twilio account being connected.
// With env vars unset this logs instead of sending, so every caller is
// exercisable end-to-end without the dependency — flip it on later by
// setting TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER.
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

export const smsConfigured = Boolean(accountSid && authToken && fromNumber);

export async function sendSms(to: string, body: string): Promise<{ sent: boolean }> {
  if (!smsConfigured) {
    console.log(`[sms:not-configured] to=${to} body="${body}"`);
    return { sent: false };
  }
  try {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ To: to, From: fromNumber!, Body: body }),
    });
    if (!res.ok) throw new Error(`Twilio responded ${res.status}`);
    return { sent: true };
  } catch (err) {
    console.error(`[sms:send-failed] to=${to}`, err);
    return { sent: false };
  }
}
