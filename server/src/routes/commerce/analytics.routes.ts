import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { getBusinessPulse } from '../../services/commerce/analytics/pulse.service.js';
import { getProductHealthScores } from '../../services/commerce/analytics/productHealth.service.js';
import { getOpportunities } from '../../services/commerce/analytics/opportunities.service.js';
import { runCommerceAudit } from '../../services/commerce/analytics/audit.service.js';
import { getCustomerTimeline } from '../../services/commerce/analytics/timeline.service.js';
import { getLunaInsights } from '../../services/commerce/analytics/lunaInsights.service.js';

export const analyticsRouter = Router();
analyticsRouter.use(authenticate, requireRole('CUSTOMER'));

analyticsRouter.get('/pulse', async (req, res) => {
  const pulse = await getBusinessPulse(req.user!.userId);
  res.json({ pulse });
});

analyticsRouter.get('/product-health', async (req, res) => {
  const products = await getProductHealthScores(req.user!.userId);
  res.json({ products });
});

analyticsRouter.get('/opportunities', async (req, res) => {
  const data = await getOpportunities(req.user!.userId);
  res.json(data);
});

analyticsRouter.post('/audit', async (req, res) => {
  const audit = await runCommerceAudit(req.user!.userId);
  res.json({ audit });
});

analyticsRouter.get('/customers/:id/timeline', async (req, res) => {
  const events = await getCustomerTimeline(req.user!.userId, req.params.id);
  res.json({ events });
});

analyticsRouter.post('/luna', async (req, res) => {
  const data = await getLunaInsights(req.user!.userId);
  res.json(data);
});
