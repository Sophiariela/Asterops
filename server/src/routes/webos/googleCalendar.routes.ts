import { Router, type Request } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';
import { buildGoogleAuthUrl, exchangeCodeForRefreshToken, googleCalendarConfigured } from '../../lib/googleCalendar.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-only-insecure-secret';
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';

type SiteParams = { siteId: string };
type OAuthState = { siteId: string; ownerId: string };

export const googleCalendarRouter = Router({ mergeParams: true });
googleCalendarRouter.use(authenticate, requireRole('CUSTOMER'));

googleCalendarRouter.get('/connect', async (req: Request<SiteParams>, res) => {
  if (!googleCalendarConfigured) {
    return res.status(503).json({ error: 'Google Calendar is not configured on this server yet.' });
  }
  const site = await prisma.site.findFirst({ where: { id: req.params.siteId, ownerId: req.user!.userId } });
  if (!site) throw new CommerceError(404, 'Site not found.');

  const state = jwt.sign({ siteId: site.id, ownerId: req.user!.userId } as OAuthState, JWT_SECRET, { expiresIn: '10m' });
  res.json({ url: buildGoogleAuthUrl(state) });
});

googleCalendarRouter.post('/disconnect', async (req: Request<SiteParams>, res) => {
  const site = await prisma.site.findFirst({ where: { id: req.params.siteId, ownerId: req.user!.userId } });
  if (!site) throw new CommerceError(404, 'Site not found.');
  await prisma.site.update({
    where: { id: site.id },
    data: { googleCalendarConnected: false, googleCalendarRefreshToken: null, googleCalendarId: null },
  });
  res.status(204).send();
});

// Mounted separately (unauthenticated path) below — Google redirects the
// browser here directly. The signed `state` param (not the session cookie)
// is what proves this callback belongs to the site that started the flow.
export const googleCalendarCallbackRouter = Router();

googleCalendarCallbackRouter.get('/callback', async (req, res) => {
  const { code, state, error } = req.query as { code?: string; state?: string; error?: string };
  if (error || !code || !state) {
    return res.redirect(`${FRONTEND_URL}/webos?googleCalendarError=1`);
  }

  let payload: OAuthState;
  try {
    payload = jwt.verify(state, JWT_SECRET) as OAuthState;
  } catch {
    return res.redirect(`${FRONTEND_URL}/webos?googleCalendarError=1`);
  }

  try {
    const refreshToken = await exchangeCodeForRefreshToken(code);
    await prisma.site.update({
      where: { id: payload.siteId },
      data: { googleCalendarConnected: true, googleCalendarRefreshToken: refreshToken, googleCalendarId: 'primary' },
    });
    res.redirect(`${FRONTEND_URL}/webos/${payload.siteId}?googleCalendarConnected=1`);
  } catch (err) {
    console.error('[google-calendar:callback-failed]', err);
    res.redirect(`${FRONTEND_URL}/webos/${payload.siteId}?googleCalendarError=1`);
  }
});
