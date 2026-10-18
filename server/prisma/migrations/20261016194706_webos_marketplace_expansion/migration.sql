-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SitePlaybook" ADD VALUE 'HOTEL';
ALTER TYPE "SitePlaybook" ADD VALUE 'CATERING';
ALTER TYPE "SitePlaybook" ADD VALUE 'SALON';
ALTER TYPE "SitePlaybook" ADD VALUE 'EDUCATION';
ALTER TYPE "SitePlaybook" ADD VALUE 'LOCAL_SERVICES';

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "appointmentBufferMinutes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "appointmentCapacity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "appointmentDurationMinutes" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "serviceArea" TEXT,
ADD COLUMN     "workingDays" INTEGER[] DEFAULT ARRAY[1, 2, 3, 4, 5]::INTEGER[];

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceCents" INTEGER,
    "durationMinutes" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedDate" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "reason" TEXT,

    CONSTRAINT "BlockedDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Service_siteId_idx" ON "Service"("siteId");

-- CreateIndex
CREATE INDEX "BlockedDate_siteId_idx" ON "BlockedDate"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedDate_siteId_date_key" ON "BlockedDate"("siteId", "date");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedDate" ADD CONSTRAINT "BlockedDate_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
