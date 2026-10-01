-- CreateEnum
CREATE TYPE "TableSection" AS ENUM ('INDOOR', 'OUTDOOR', 'PATIO', 'VIP');

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "closingTime" TEXT,
ADD COLUMN     "maxPartySize" INTEGER,
ADD COLUMN     "openingTime" TEXT,
ADD COLUMN     "reservationIntervalMinutes" INTEGER NOT NULL DEFAULT 30;

-- AlterTable
ALTER TABLE "Table" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "section" "TableSection";
