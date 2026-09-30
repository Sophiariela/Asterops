import { Router } from 'express';
import { z } from 'zod';
import * as pageViewsService from '../../services/webos/pageViews.service.js';

const recordViewSchema = z.object({
  siteId: z.string().min(1),
  pageSlug: z.string().min(1).max(60),
});

// Unauthenticated: fired from the public site renderer on every page load.
export const publicPageViewsRouter = Router();

publicPageViewsRouter.post('/', async (req, res) => {
  const parsed = recordViewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(204).send();
  }
  await pageViewsService.recordView(parsed.data.siteId, parsed.data.pageSlug);
  res.status(204).send();
});
