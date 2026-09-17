import { Router, type Request } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { getWebsiteHealth } from '../../services/webos/analytics/healthScore.service.js';
import { runConversionAudit } from '../../services/webos/analytics/conversionAudit.service.js';
import { getTrustGaps } from '../../services/webos/analytics/trustEngine.service.js';
import { getTrustMap } from '../../services/webos/analytics/trustMap.service.js';
import { getRecommendedActions } from '../../services/webos/analytics/actionCenter.service.js';
import { getWebsiteArchitecture } from '../../services/webos/analytics/architecture.service.js';
import { getConversionPaths } from '../../services/webos/analytics/conversionPaths.service.js';
import { getPageInventory } from '../../services/webos/analytics/pageInventory.service.js';
import { getSectionInventory } from '../../services/webos/analytics/sectionInventory.service.js';
import { getLeadCaptureMap } from '../../services/webos/analytics/leadCaptureMap.service.js';
import { getDeploymentReadiness } from '../../services/webos/analytics/deploymentReadiness.service.js';
import { reviewPage, reviewBlueprint } from '../../services/webos/analytics/lunaStrategist.service.js';

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

webosAnalyticsRouter.get('/trust-map', async (req: Request<SiteParams>, res) => {
  const trustMap = await getTrustMap(req.user!.userId, req.params.siteId);
  res.json({ trustMap });
});

webosAnalyticsRouter.get('/action-center', async (req: Request<SiteParams>, res) => {
  const actions = await getRecommendedActions(req.user!.userId, req.params.siteId);
  res.json({ actions });
});

webosAnalyticsRouter.get('/architecture', async (req: Request<SiteParams>, res) => {
  const architecture = await getWebsiteArchitecture(req.user!.userId, req.params.siteId);
  res.json({ architecture });
});

webosAnalyticsRouter.get('/conversion-paths', async (req: Request<SiteParams>, res) => {
  const conversionPaths = await getConversionPaths(req.user!.userId, req.params.siteId);
  res.json(conversionPaths);
});

webosAnalyticsRouter.get('/page-inventory', async (req: Request<SiteParams>, res) => {
  const pages = await getPageInventory(req.user!.userId, req.params.siteId);
  res.json({ pages });
});

webosAnalyticsRouter.get('/section-inventory', async (req: Request<SiteParams>, res) => {
  const pages = await getSectionInventory(req.user!.userId, req.params.siteId);
  res.json({ pages });
});

webosAnalyticsRouter.get('/lead-capture-map', async (req: Request<SiteParams>, res) => {
  const leadCaptureMap = await getLeadCaptureMap(req.user!.userId, req.params.siteId);
  res.json({ leadCaptureMap });
});

webosAnalyticsRouter.get('/deployment-readiness', async (req: Request<SiteParams>, res) => {
  const readiness = await getDeploymentReadiness(req.user!.userId, req.params.siteId);
  res.json({ readiness });
});

webosAnalyticsRouter.post('/luna/blueprint', async (req: Request<SiteParams>, res) => {
  const data = await reviewBlueprint(req.user!.userId, req.params.siteId);
  res.json(data);
});

webosAnalyticsRouter.post('/luna/:pageId', async (req: Request<SiteParams & { pageId: string }>, res) => {
  const data = await reviewPage(req.user!.userId, req.params.siteId, req.params.pageId);
  res.json(data);
});
