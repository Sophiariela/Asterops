import { Router, type Request } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { createTableSchema } from '../../validation/webos.js';
import * as reservationsService from '../../services/webos/reservations.service.js';

type SiteParams = { siteId: string };

export const tablesRouter = Router({ mergeParams: true });
tablesRouter.use(authenticate, requireRole('CUSTOMER'));

tablesRouter.get('/', async (req: Request<SiteParams>, res) => {
  const tables = await reservationsService.listTables(req.user!.userId, req.params.siteId);
  res.json({ tables });
});

tablesRouter.post('/', async (req: Request<SiteParams>, res) => {
  const parsed = createTableSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const table = await reservationsService.createTable(req.user!.userId, req.params.siteId, parsed.data);
  res.status(201).json({ table });
});

tablesRouter.delete('/:id', async (req: Request<SiteParams & { id: string }>, res) => {
  await reservationsService.deleteTable(req.user!.userId, req.params.siteId, req.params.id);
  res.status(204).send();
});
