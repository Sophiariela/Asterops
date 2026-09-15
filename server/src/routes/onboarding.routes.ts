import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

export const onboardingRouter = Router();

onboardingRouter.use(authenticate, requireRole('CUSTOMER'));

const submissionSchema = z.object({
  companyName: z.string().min(1),
  businessType: z.string().min(1),
  websiteUrl: z.string().optional(),
  instagram: z.string().optional(),
  primaryGoal: z.string().min(1),
  targetAudience: z.string().min(1),
  brandColors: z.string().optional(),
  additionalNotes: z.string().optional(),
});

onboardingRouter.post(
  '/',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'brandAssets', maxCount: 10 },
  ]),
  async (req, res) => {
    const parsed = submissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
    }

    const files = req.files as { [field: string]: Express.Multer.File[] } | undefined;
    const logoFile = files?.logo?.[0];
    const brandAssetFiles = files?.brandAssets ?? [];

    const data = {
      ...parsed.data,
      ...(logoFile ? { logoUrl: `/uploads/${logoFile.filename}` } : {}),
      ...(brandAssetFiles.length ? { brandAssetUrls: brandAssetFiles.map((f) => `/uploads/${f.filename}`) } : {}),
    };

    const submission = await prisma.onboardingSubmission.upsert({
      where: { customerId: req.user!.userId },
      update: data,
      create: { ...data, customerId: req.user!.userId },
    });

    // Mark the customer's most recent paid order as ready for deployment review.
    const latestPaidOrder = await prisma.order.findFirst({
      where: { customerId: req.user!.userId, status: 'PAID' },
      orderBy: { createdAt: 'desc' },
    });
    if (latestPaidOrder) {
      await prisma.deploymentStatus.upsert({
        where: { orderId: latestPaidOrder.id },
        update: { status: 'PENDING' },
        create: { orderId: latestPaidOrder.id, status: 'PENDING' },
      });
    }

    res.status(201).json({ submission, deploymentStatus: 'PENDING' });
  },
);

onboardingRouter.get('/me', async (req, res) => {
  const submission = await prisma.onboardingSubmission.findUnique({
    where: { customerId: req.user!.userId },
  });
  res.json({ submission });
});
