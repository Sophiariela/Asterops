-- AlterTable
-- DEFAULT CURRENT_TIMESTAMP backfills any existing rows safely; Prisma
-- Client sets this column explicitly on every write going forward.
ALTER TABLE "Lead" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
