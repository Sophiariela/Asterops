import type { ReviewStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CommerceError } from '../../lib/commerceError.js';
import { sendEmail } from '../../lib/mailer.js';
import { reviewNotificationEmail } from '../../lib/emailTemplates.js';

async function assertSiteOwned(ownerId: string, siteId: string) {
  const site = await prisma.site.findFirst({ where: { id: siteId, ownerId } });
  if (!site) throw new CommerceError(404, 'Site not found.');
}

export async function listReviews(ownerId: string, siteId: string) {
  await assertSiteOwned(ownerId, siteId);
  return prisma.review.findMany({ where: { siteId }, orderBy: { createdAt: 'desc' } });
}

export async function submitPublicReview(data: {
  siteId: string;
  authorName: string;
  authorEmail?: string;
  rating: number;
  comment: string;
  source?: string;
}) {
  const site = await prisma.site.findUnique({
    where: { id: data.siteId },
    include: { owner: { select: { email: true } } },
  });
  if (!site) throw new CommerceError(404, 'Site not found.');

  const review = await prisma.review.create({ data });

  const to = site.reviewEmail ?? site.owner.email;
  await sendEmail({
    to,
    subject: `New review from ${data.authorName}`,
    html: reviewNotificationEmail(site.businessName, { authorName: data.authorName, rating: data.rating, comment: data.comment, source: data.source ?? null }),
  });

  return review;
}

// Turns a visitor-submitted Review into a visible Testimonial — the only
// path a Review reaches the public site, so an owner always sees it first.
export async function promoteReviewToTestimonial(ownerId: string, siteId: string, reviewId: string) {
  await assertSiteOwned(ownerId, siteId);
  const review = await prisma.review.findFirst({ where: { id: reviewId, siteId } });
  if (!review) throw new CommerceError(404, 'Review not found.');

  const [testimonial] = await prisma.$transaction([
    prisma.testimonial.create({
      data: { siteId, authorName: review.authorName, quote: review.comment, rating: review.rating },
    }),
    prisma.review.update({ where: { id: reviewId }, data: { status: 'PUBLISHED' } }),
  ]);
  return testimonial;
}

export async function updateReviewStatus(ownerId: string, siteId: string, reviewId: string, status: ReviewStatus) {
  await assertSiteOwned(ownerId, siteId);
  const existing = await prisma.review.findFirst({ where: { id: reviewId, siteId } });
  if (!existing) throw new CommerceError(404, 'Review not found.');
  return prisma.review.update({ where: { id: reviewId }, data: { status } });
}

export async function deleteReview(ownerId: string, siteId: string, reviewId: string) {
  await assertSiteOwned(ownerId, siteId);
  const existing = await prisma.review.findFirst({ where: { id: reviewId, siteId } });
  if (!existing) throw new CommerceError(404, 'Review not found.');
  await prisma.review.delete({ where: { id: reviewId } });
}
