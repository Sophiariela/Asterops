import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import sharp from 'sharp';
import type { Request, Response, NextFunction } from 'express';
import { CommerceError } from '../lib/commerceError.js';

// UPLOAD_DIR points at a mounted persistent disk in production (Render's
// filesystem is otherwise ephemeral and wipes /uploads on every deploy).
export const UPLOAD_ROOT = process.env.UPLOAD_DIR ?? path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(UPLOAD_ROOT, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_ROOT),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.mimetype)) {
      cb(new CommerceError(400, 'Unsupported file type. Use JPG, PNG or WEBP.'));
      return;
    }
    cb(null, true);
  },
});

// Multer surfaces both its own errors (LIMIT_FILE_SIZE, etc.) and whatever
// fileFilter passed to cb() as a generic Error subclass — neither is a
// CommerceError, so without this they'd fall through to the app's default
// handler and show the user a vague "Something went wrong" instead of the
// real reason (file too large, wrong type).
export function handleUploadError(err: unknown, _req: Request, res: Response, next: NextFunction) {
  if (err instanceof CommerceError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File is too large. Max size is 10MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  next(err);
}

const RESIZABLE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_DIMENSION = 1920;

// Runs after multer has already written the file to disk. Large photos
// (phone camera originals routinely exceed 4000px / several MB) get
// downscaled in place so pages don't ship multi-megabyte hero images just
// because that's the size the visitor's camera happened to produce.
export async function resizeUploadedImage(req: Request, _res: Response, next: NextFunction) {
  const file = req.file;
  if (!file || !RESIZABLE_TYPES.has(file.mimetype)) return next();
  try {
    const image = sharp(file.path);
    const metadata = await image.metadata();
    if (!metadata.width || metadata.width <= MAX_DIMENSION) return next();

    const format = file.mimetype === 'image/png' ? 'png' : file.mimetype === 'image/webp' ? 'webp' : 'jpeg';
    const tempPath = `${file.path}.resized`;
    await image
      .resize({ width: MAX_DIMENSION, withoutEnlargement: true })
      .toFormat(format, { quality: 82 })
      .toFile(tempPath);
    await fs.promises.rename(tempPath, file.path);
    next();
  } catch {
    // A corrupt/unreadable image shouldn't block the upload — the original
    // file multer already saved is still a valid, if unresized, result.
    next();
  }
}
