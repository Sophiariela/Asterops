import crypto from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { hashPassword, verifyPassword, signSession, sessionCookieOptions, SESSION_COOKIE } from '../lib/auth.js';
import { authenticate } from '../middleware/auth.js';

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

authRouter.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' });
  }
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: 'CUSTOMER' },
  });

  const token = signSession({ userId: user.id, role: user.role });
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions());
  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = signSession({ userId: user.id, role: user.role });
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions());
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.status(204).send();
});

authRouter.get('/me', authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

const forgotSchema = z.object({ email: z.string().email() });

authRouter.post('/forgot-password', async (req, res) => {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  // Always respond 200 so we don't leak which emails have accounts.
  if (!user) {
    return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  // TODO: wire up a transactional email provider. Logging for now so the
  // flow is testable end-to-end without external dependencies.
  console.log(`[password reset] ${user.email}: ${process.env.FRONTEND_URL}/reset-password?token=${token}`);

  res.status(200).json({
    message: 'If that email exists, a reset link has been sent.',
    ...(process.env.NODE_ENV !== 'production' ? { devToken: token } : {}),
  });
});

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(200),
});

authRouter.post('/reset-password', async (req, res) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'A valid token and new password are required.' });
  }
  const { token, password } = parsed.data;

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return res.status(400).json({ error: 'This reset link is invalid or has expired.' });
  }

  const passwordHash = await hashPassword(password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ]);

  res.json({ message: 'Password updated. You can now log in.' });
});
