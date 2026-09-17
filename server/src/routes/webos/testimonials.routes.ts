import { Router, type Request } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { createTestimonialSchema } from '../../validation/webos.js';
import * as testimonialsService from '../../services/webos/testimonials.service.js';

type SiteParams = { siteId: string };

export const testimonialsRouter = Router({ mergeParams: true });
testimonialsRouter.use(authenticate, requireRole('CUSTOMER'));

testimonialsRouter.get('/', async (req: Request<SiteParams>, res) => {
  const testimonials = await testimonialsService.listTestimonials(req.user!.userId, req.params.siteId);
  res.json({ testimonials });
});

testimonialsRouter.post('/', async (req: Request<SiteParams>, res) => {
  const parsed = createTestimonialSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const testimonial = await testimonialsService.createTestimonial(req.user!.userId, req.params.siteId, parsed.data);
  res.status(201).json({ testimonial });
});

testimonialsRouter.delete('/:id', async (req: Request<SiteParams & { id: string }>, res) => {
  await testimonialsService.deleteTestimonial(req.user!.userId, req.params.siteId, req.params.id);
  res.status(204).send();
});
