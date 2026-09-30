-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('NEW', 'PUBLISHED', 'HIDDEN');

-- AlterEnum: LeadStatus gains CONTACTED/CLOSED, drops CONVERTED/LOST.
-- Existing rows are remapped rather than blind-cast, since a straight
-- text cast fails for any row still holding a removed value.
BEGIN;
CREATE TYPE "LeadStatus_new" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED');
ALTER TABLE "public"."Lead" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Lead" ALTER COLUMN "status" TYPE "LeadStatus_new" USING (
  CASE "status"::text
    WHEN 'CONVERTED' THEN 'CLOSED'
    WHEN 'LOST' THEN 'CLOSED'
    ELSE "status"::text
  END
)::"LeadStatus_new";
ALTER TYPE "LeadStatus" RENAME TO "LeadStatus_old";
ALTER TYPE "LeadStatus_new" RENAME TO "LeadStatus";
DROP TYPE "public"."LeadStatus_old";
ALTER TABLE "Lead" ALTER COLUMN "status" SET DEFAULT 'NEW';
COMMIT;

-- AlterEnum
ALTER TYPE "ReservationStatus" ADD VALUE 'SEATED';
ALTER TYPE "ReservationStatus" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "premiumEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reservationEmail" TEXT,
ADD COLUMN     "reviewEmail" TEXT,
ADD COLUMN     "whatsappNumber" TEXT;

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorEmail" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "source" TEXT,
    "status" "ReviewStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Review_siteId_idx" ON "Review"("siteId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
