import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Neon Object Storage — S3-compatible, branches with the database. Used
// so uploaded images (logos, hero photos, menu photos) survive a deploy;
// local disk on Render is otherwise wiped every time (see
// middleware/upload.ts). Configured via the standard AWS_* env vars
// (same names the AWS SDK reads automatically) plus UPLOAD_BUCKET.
const endpoint = process.env.AWS_ENDPOINT_URL_S3;
const bucket = process.env.UPLOAD_BUCKET ?? 'uploads';

const s3 = endpoint
  ? new S3Client({ endpoint, region: process.env.AWS_REGION, forcePathStyle: true })
  : null;

export function objectStorageConfigured(): boolean {
  return !!s3;
}

// Returns the public URL of the stored object — only meaningful for a
// public_read bucket (this app's `uploads` bucket), since every image
// stored here (logos, site photos) is meant to be publicly viewable on
// a published site with no auth.
export async function uploadToObjectStorage(key: string, body: Buffer, contentType: string): Promise<string> {
  if (!s3) throw new Error('Object storage is not configured.');
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
  return `${endpoint}/${bucket}/${key}`;
}
