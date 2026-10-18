import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import sharp from 'sharp';
import type { Request, Response, NextFunction } from 'express';
import { CommerceError } from '../lib/commerceError.js';
import { objectStorageConfigured, uploadToObjectStorage } from '../lib/objectStorage.js';

// Where multer first writes an upload and resizeUploadedImage operates —
// now just a scratch location, not the final durable home. persistUpload
// (below) moves the file into Neon Object Storage and deletes it from
// here when object storage is configured; UPLOAD_DIR only matters as a
// genuine storage location for the local-disk fallback path (object
// storage not configured), where it should point at a mounted
// persistent disk — Render's own filesystem is otherwise ephemeral and
// wipes /uploads on every deploy.
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

// Runs after resizeUploadedImage. When Neon Object Storage is configured,
// uploads the (already-resized) file there and deletes the local temp
// copy, so the image survives a deploy. Without it, the file is left on
// local disk exactly as before — uploads keep working, just not
// durably, until object storage is configured (see getUploadedUrl below,
// and .env.example for the required vars).
export async function persistUpload(req: Request, _res: Response, next: NextFunction) {
  const file = req.file;
  if (!file || !objectStorageConfigured()) return next();
  try {
    const buffer = await fs.promises.readFile(file.path);
    const url = await uploadToObjectStorage(file.filename, buffer, file.mimetype);
    (req as Request & { uploadedUrl?: string }).uploadedUrl = url;
    await fs.promises.unlink(file.path).catch(() => {});
  } catch (err) {
    // Object storage failed (network, bad credentials) — the local file
    // multer already saved is still a valid, if non-durable, result;
    // don't fail the request over it.
    console.error('Object storage upload failed, falling back to local disk:', err);
  }
  next();
}

// The URL a route handler should store for this request's uploaded file —
// the object storage URL when persistUpload used it, otherwise the
// existing local /uploads/ path. Centralized so every route gets the
// durable path automatically the moment object storage is configured,
// with no per-route changes.
export function getUploadedUrl(req: Request): string {
  const withUrl = req as Request & { uploadedUrl?: string };
  if (withUrl.uploadedUrl) return withUrl.uploadedUrl;
  return `/uploads/${req.file!.filename}`;
}
