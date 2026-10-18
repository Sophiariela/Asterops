import { Router, type Request } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { createServiceSchema, updateServiceSchema } from '../../validation/webos.js';
import * as servicesService from '../../services/webos/services.service.js';

type SiteParams = { siteId: string };

// Authenticated: the tenant managing their Service catalog (Salon,
// Education, Professional Services, Fitness).
export const servicesRouter = Router({ mergeParams: true });
servicesRouter.use(authenticate, requireRole('CUSTOMER'));

servicesRouter.get('/', async (req: Request<SiteParams>, res) => {
  const services = await servicesService.listServices(req.user!.userId, req.params.siteId);
  res.json({ services });
});

servicesRouter.post('/', async (req: Request<SiteParams>, res) => {
  const parsed = createServiceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const service = await servicesService.createService(req.user!.userId, req.params.siteId, parsed.data);
  res.status(201).json({ service });
});

servicesRouter.patch('/:id', async (req: Request<SiteParams & { id: string }>, res) => {
  const parsed = updateServiceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const service = await servicesService.updateService(req.user!.userId, req.params.siteId, req.params.id, parsed.data);
  res.json({ service });
});

servicesRouter.delete('/:id', async (req: Request<SiteParams & { id: string }>, res) => {
  await servicesService.deleteService(req.user!.userId, req.params.siteId, req.params.id);
  res.status(204).send();
});

// Unauthenticated: the live public site renderer's service catalog /
// booking form.
export const publicServicesRouter = Router();

publicServicesRouter.get('/:siteId', async (req, res) => {
  const services = await servicesService.listPublicServices(req.params.siteId);
  res.json({ services });
});
