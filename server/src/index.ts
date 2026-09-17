import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.routes.js';
import { plansRouter } from './routes/plans.routes.js';
import { checkoutRouter } from './routes/checkout.routes.js';
import { onboardingRouter } from './routes/onboarding.routes.js';
import { dashboardRouter } from './routes/dashboard.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { webhooksRouter } from './routes/webhooks.routes.js';
import { categoriesRouter } from './routes/commerce/categories.routes.js';
import { productsRouter } from './routes/commerce/products.routes.js';
import { inventoryRouter } from './routes/commerce/inventory.routes.js';
import { customersRouter } from './routes/commerce/customers.routes.js';
import { ordersRouter } from './routes/commerce/orders.routes.js';
import { analyticsRouter } from './routes/commerce/analytics.routes.js';
import { sitesRouter } from './routes/webos/sites.routes.js';
import { pagesRouter } from './routes/webos/pages.routes.js';
import { testimonialsRouter } from './routes/webos/testimonials.routes.js';
import { trustElementsRouter } from './routes/webos/trustElements.routes.js';
import { leadsRouter, publicLeadsRouter } from './routes/webos/leads.routes.js';
import { webosAnalyticsRouter } from './routes/webos/analytics.routes.js';
import { CommerceError } from './lib/commerceError.js';
import { UPLOAD_ROOT } from './middleware/upload.js';

const app = express();
const PORT = process.env.PORT ?? 4000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';

// Render terminates TLS at a proxy in front of this app — without this,
// Express sees plain HTTP and req.secure is always false, which breaks
// the Secure session cookie required for cross-site auth in production.
app.set('trust proxy', 1);

app.use(cors({ origin: FRONTEND_URL, credentials: true }));

// Stripe webhook needs the raw body for signature verification, so it's
// mounted (and fully handled) before the JSON body parser below runs.
app.use('/api/webhooks', express.raw({ type: 'application/json' }));
app.use('/api/webhooks', webhooksRouter);

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(UPLOAD_ROOT));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRouter);
app.use('/api/plans', plansRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/onboarding', onboardingRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/admin', adminRouter);

// CommerceOS
app.use('/api/commerce/categories', categoriesRouter);
app.use('/api/commerce/products', productsRouter);
app.use('/api/commerce/inventory', inventoryRouter);
app.use('/api/commerce/customers', customersRouter);
app.use('/api/commerce/orders', ordersRouter);
app.use('/api/commerce/analytics', analyticsRouter);

app.use('/api/commerce', (err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof CommerceError) {
    return res.status(err.status).json({ error: err.message });
  }
  next(err);
});

// WebOS
app.use('/api/webos/public/leads', publicLeadsRouter);
app.use('/api/webos/sites/:siteId/testimonials', testimonialsRouter);
app.use('/api/webos/sites/:siteId/trust-elements', trustElementsRouter);
app.use('/api/webos/sites/:siteId/leads', leadsRouter);
app.use('/api/webos/sites/:siteId/analytics', webosAnalyticsRouter);
app.use('/api/webos/sites', sitesRouter);
app.use('/api/webos/pages', pagesRouter);

app.use('/api/webos', (err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof CommerceError) {
    return res.status(err.status).json({ error: err.message });
  }
  next(err);
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on our end.' });
});

app.listen(PORT, () => {
  console.log(`ASTER API listening on http://localhost:${PORT}`);
});
