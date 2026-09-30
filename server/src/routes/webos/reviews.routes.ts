import { Router, type Request } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { createReviewPublicSchema, updateReviewStatusSchema } from '../../validation/webos.js';
import * as reviewsService from '../../services/webos/reviews.service.js';

type SiteParams = { siteId: string };

// Authenticated: the tenant viewing/managing their own site's reviews.
export const reviewsRouter = Router({ mergeParams: true });
reviewsRouter.use(authenticate, requireRole('CUSTOMER'));

reviewsRouter.get('/', async (req: Request<SiteParams>, res) => {
  const reviews = await reviewsService.listReviews(req.user!.userId, req.params.siteId);
  res.json({ reviews });
});

reviewsRouter.post('/:id/promote', async (req: Request<SiteParams & { id: string }>, res) => {
  const testimonial = await reviewsService.promoteReviewToTestimonial(req.user!.userId, req.params.siteId, req.params.id);
  res.status(201).json({ testimonial });
});

reviewsRouter.patch('/:id/status', async (req: Request<SiteParams & { id: string }>, res) => {
  const parsed = updateReviewStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const review = await reviewsService.updateReviewStatus(req.user!.userId, req.params.siteId, req.params.id, parsed.data.status);
  res.json({ review });
});

reviewsRouter.delete('/:id', async (req: Request<SiteParams & { id: string }>, res) => {
  await reviewsService.deleteReview(req.user!.userId, req.params.siteId, req.params.id);
  res.status(204).send();
});

// Unauthenticated: called from the visitor-facing review form rendered by
// the public site at /site/:slug.
export const publicReviewsRouter = Router();

publicReviewsRouter.post('/', async (req, res) => {
  const parsed = createReviewPublicSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const review = await reviewsService.submitPublicReview(parsed.data);
  res.status(201).json({ review: { id: review.id } });
});
