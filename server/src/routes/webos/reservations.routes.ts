import { Router, type Request } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import {
  createReservationSchema, publicReservationSchema, updateReservationStatusSchema, assignTableSchema,
} from '../../validation/webos.js';
import * as reservationsService from '../../services/webos/reservations.service.js';
import type { ReservationStatus } from '@prisma/client';

type SiteParams = { siteId: string };

export const reservationsRouter = Router({ mergeParams: true });
reservationsRouter.use(authenticate, requireRole('CUSTOMER'));

reservationsRouter.get('/', async (req: Request<SiteParams>, res) => {
  const status = req.query.status as ReservationStatus | undefined;
  const reservations = await reservationsService.listReservations(req.user!.userId, req.params.siteId, status);
  res.json({ reservations });
});

reservationsRouter.post('/', async (req: Request<SiteParams>, res) => {
  const parsed = createReservationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const reservation = await reservationsService.createReservation(req.user!.userId, req.params.siteId, parsed.data);
  res.status(201).json({ reservation });
});

reservationsRouter.patch('/:id/status', async (req: Request<SiteParams & { id: string }>, res) => {
  const parsed = updateReservationStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const reservation = await reservationsService.updateReservationStatus(req.user!.userId, req.params.siteId, req.params.id, parsed.data.status);
  res.json({ reservation });
});

reservationsRouter.patch('/:id/table', async (req: Request<SiteParams & { id: string }>, res) => {
  const parsed = assignTableSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const reservation = await reservationsService.assignTable(req.user!.userId, req.params.siteId, req.params.id, parsed.data.tableId);
  res.json({ reservation });
});

// Unauthenticated: called from the visitor-facing reservation form
// rendered by the public site at /site/:slug.
export const publicReservationsRouter = Router();

publicReservationsRouter.post('/', async (req, res) => {
  const parsed = publicReservationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const reservation = await reservationsService.submitPublicReservation(parsed.data);
  res.status(201).json({ reservation: { id: reservation.id, status: reservation.status } });
});
