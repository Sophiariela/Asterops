import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-only-insecure-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

export const SESSION_COOKIE = 'aster_session';

export type SessionPayload = {
  userId: string;
  role: 'CUSTOMER' | 'ADMIN';
};

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifySession(token: string): SessionPayload {
  return jwt.verify(token, JWT_SECRET) as SessionPayload;
}

export function sessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  // Render (API) and the frontend host are different origins in production,
  // so the cookie must be sent cross-site — that requires SameSite=None,
  // which browsers only honor when Secure is also set.
  const sameSite: 'none' | 'lax' = isProduction ? 'none' : 'lax';
  return {
    httpOnly: true,
    sameSite,
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}
