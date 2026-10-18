import { Router, type Request } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { createBlockedDateSchema } from '../../validation/webos.js';
import * as blockedDatesService from '../../services/webos/blockedDates.service.js';

type SiteParams = { siteId: string };

export const blockedDatesRouter = Router({ mergeParams: true });
blockedDatesRouter.use(authenticate, requireRole('CUSTOMER'));

blockedDatesRouter.get('/', async (req: Request<SiteParams>, res) => {
  const blockedDates = await blockedDatesService.listBlockedDates(req.user!.userId, req.params.siteId);
  res.json({ blockedDates });
});

blockedDatesRouter.post('/', async (req: Request<SiteParams>, res) => {
  const parsed = createBlockedDateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const blockedDate = await blockedDatesService.createBlockedDate(req.user!.userId, req.params.siteId, parsed.data);
  res.status(201).json({ blockedDate });
});

blockedDatesRouter.delete('/:id', async (req: Request<SiteParams & { id: string }>, res) => {
  await blockedDatesService.deleteBlockedDate(req.user!.userId, req.params.siteId, req.params.id);
  res.status(204).send();
});
