import type { NextFunction, Request, Response } from 'express';
import { SESSION_COOKIE, verifySession, type SessionPayload } from '../lib/auth.js';

declare global {
  namespace Express {
    interface Request {
      user?: SessionPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  try {
    req.user = verifySession(token);
    next();
  } catch {
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
}

export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) {
    try {
      req.user = verifySession(token);
    } catch {
      // ignore invalid/expired token for optional auth
    }
  }
  next();
}

export function requireRole(...roles: Array<'CUSTOMER' | 'ADMIN'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized for this resource.' });
    }
    next();
  };
}
