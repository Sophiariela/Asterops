import { Router, type Request } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { createTableSchema, updateTableSchema } from '../../validation/webos.js';
import * as tablesService from '../../services/webos/tables.service.js';

type SiteParams = { siteId: string };

export const tablesRouter = Router({ mergeParams: true });
tablesRouter.use(authenticate, requireRole('CUSTOMER'));

tablesRouter.get('/', async (req: Request<SiteParams>, res) => {
  const tables = await tablesService.listTables(req.user!.userId, req.params.siteId);
  res.json({ tables });
});

tablesRouter.get('/status', async (req: Request<SiteParams>, res) => {
  const tables = await tablesService.listTablesWithStatus(req.user!.userId, req.params.siteId);
  res.json({ tables });
});

tablesRouter.get('/occupancy', async (req: Request<SiteParams>, res) => {
  const occupancy = await tablesService.getOccupancy(req.user!.userId, req.params.siteId);
  res.json({ occupancy });
});

tablesRouter.get('/suggest', async (req: Request<SiteParams>, res) => {
  const partySize = Number(req.query.partySize);
  const reservationAt = new Date(String(req.query.reservationAt));
  if (!Number.isInteger(partySize) || partySize < 1 || Number.isNaN(reservationAt.getTime())) {
    return res.status(400).json({ error: 'Invalid partySize or reservationAt.' });
  }
  const table = await tablesService.suggestTable(req.user!.userId, req.params.siteId, partySize, reservationAt);
  res.json({ table });
});

tablesRouter.post('/', async (req: Request<SiteParams>, res) => {
  const parsed = createTableSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const table = await tablesService.createTable(req.user!.userId, req.params.siteId, parsed.data);
  res.status(201).json({ table });
});

tablesRouter.patch('/:id', async (req: Request<SiteParams & { id: string }>, res) => {
  const parsed = updateTableSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const table = await tablesService.updateTable(req.user!.userId, req.params.siteId, req.params.id, parsed.data);
  res.json({ table });
});

tablesRouter.delete('/:id', async (req: Request<SiteParams & { id: string }>, res) => {
  await tablesService.deleteTable(req.user!.userId, req.params.siteId, req.params.id);
  res.status(204).send();
});
