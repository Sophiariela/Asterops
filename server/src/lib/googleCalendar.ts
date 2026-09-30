// Premium feature, scaffolded ahead of a Google Cloud OAuth client being
// connected. Unlike Resend/Twilio/WhatsApp (one server-wide credential),
// each restaurant owner's calendar needs its own OAuth grant, so the
// per-site refresh token (Site.googleCalendarRefreshToken) does the work
// a shared env-var credential can't. Plain fetch against the REST API,
// matching sms.ts/whatsapp.ts, rather than pulling in the googleapis SDK.
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

export const googleCalendarConfigured = Boolean(clientId && clientSecret && redirectUri);

const SCOPE = 'https://www.googleapis.com/auth/calendar.events';

// `state` carries the siteId through the redirect round trip so the
// callback knows which site's tokens to store.
export function buildGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri!,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForRefreshToken(code: string): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: redirectUri!,
      grant_type: 'authorization_code',
    }),
  });
  if (!res.ok) throw new Error(`Google token exchange failed: ${res.status}`);
  const data = (await res.json()) as { refresh_token?: string };
  if (!data.refresh_token) throw new Error('Google did not return a refresh token (was prompt=consent applied?).');
  return data.refresh_token;
}

async function getAccessToken(refreshToken: string): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId!,
      client_secret: clientSecret!,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error(`Google access token refresh failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

type CalendarEventInput = {
  summary: string;
  description?: string;
  startIso: string;
  endIso: string;
};

export async function createCalendarEvent(refreshToken: string, calendarId: string, event: CalendarEventInput): Promise<string | null> {
  try {
    const accessToken = await getAccessToken(refreshToken);
    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        summary: event.summary,
        description: event.description,
        start: { dateTime: event.startIso },
        end: { dateTime: event.endIso },
      }),
    });
    if (!res.ok) throw new Error(`Google Calendar create failed: ${res.status}`);
    const data = (await res.json()) as { id: string };
    return data.id;
  } catch (err) {
    console.error('[google-calendar:create-failed]', err);
    return null;
  }
}

export async function updateCalendarEvent(refreshToken: string, calendarId: string, eventId: string, event: CalendarEventInput): Promise<boolean> {
  try {
    const accessToken = await getAccessToken(refreshToken);
    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        summary: event.summary,
        description: event.description,
        start: { dateTime: event.startIso },
        end: { dateTime: event.endIso },
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('[google-calendar:update-failed]', err);
    return false;
  }
}

export async function deleteCalendarEvent(refreshToken: string, calendarId: string, eventId: string): Promise<boolean> {
  try {
    const accessToken = await getAccessToken(refreshToken);
    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.ok || res.status === 410; // 410 Gone = already deleted, treat as success
  } catch (err) {
    console.error('[google-calendar:delete-failed]', err);
    return false;
  }
}
