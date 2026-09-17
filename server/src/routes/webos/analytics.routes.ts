import { Router, type Request } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { getWebsiteHealth } from '../../services/webos/analytics/healthScore.service.js';
import { runConversionAudit } from '../../services/webos/analytics/conversionAudit.service.js';
import { getTrustGaps } from '../../services/webos/analytics/trustEngine.service.js';
import { getRecommendedActions } from '../../services/webos/analytics/actionCenter.service.js';
import { reviewPage } from '../../services/webos/analytics/lunaStrategist.service.js';

type SiteParams = { siteId: string };

export const webosAnalyticsRouter = Router({ mergeParams: true });
webosAnalyticsRouter.use(authenticate, requireRole('CUSTOMER'));

webosAnalyticsRouter.get('/health-score', async (req: Request<SiteParams>, res) => {
  const health = await getWebsiteHealth(req.user!.userId, req.params.siteId);
  res.json({ health });
});

webosAnalyticsRouter.post('/conversion-audit', async (req: Request<SiteParams>, res) => {
  const audit = await runConversionAudit(req.user!.userId, req.params.siteId);
  res.json({ audit });
});

webosAnalyticsRouter.get('/trust-gaps', async (req: Request<SiteParams>, res) => {
  const trust = await getTrustGaps(req.user!.userId, req.params.siteId);
  res.json({ trust });
});

webosAnalyticsRouter.get('/action-center', async (req: Request<SiteParams>, res) => {
  const actions = await getRecommendedActions(req.user!.userId, req.params.siteId);
  res.json({ actions });
});

webosAnalyticsRouter.post('/luna/:pageId', async (req: Request<SiteParams & { pageId: string }>, res) => {
  const data = await reviewPage(req.user!.userId, req.params.siteId, req.params.pageId);
  res.json(data);
});
