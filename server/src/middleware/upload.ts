import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';

export const UPLOAD_ROOT = path.resolve(process.cwd(), 'uploads');
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
      cb(new Error('Unsupported file type.'));
      return;
    }
    cb(null, true);
  },
});
