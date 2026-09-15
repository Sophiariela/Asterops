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
import { UPLOAD_ROOT } from './middleware/upload.js';

const app = express();
const PORT = process.env.PORT ?? 4000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';

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

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on our end.' });
});

app.listen(PORT, () => {
  console.log(`ASTER API listening on http://localhost:${PORT}`);
});
