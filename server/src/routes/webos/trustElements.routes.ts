import { Router, type Request } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { createTrustElementSchema } from '../../validation/webos.js';
import * as trustElementsService from '../../services/webos/trustElements.service.js';

type SiteParams = { siteId: string };

export const trustElementsRouter = Router({ mergeParams: true });
trustElementsRouter.use(authenticate, requireRole('CUSTOMER'));

trustElementsRouter.get('/', async (req: Request<SiteParams>, res) => {
  const trustElements = await trustElementsService.listTrustElements(req.user!.userId, req.params.siteId);
  res.json({ trustElements });
});

trustElementsRouter.post('/', async (req: Request<SiteParams>, res) => {
  const parsed = createTrustElementSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const trustElement = await trustElementsService.createTrustElement(req.user!.userId, req.params.siteId, parsed.data);
  res.status(201).json({ trustElement });
});

trustElementsRouter.delete('/:id', async (req: Request<SiteParams & { id: string }>, res) => {
  await trustElementsService.deleteTrustElement(req.user!.userId, req.params.siteId, req.params.id);
  res.status(204).send();
});
