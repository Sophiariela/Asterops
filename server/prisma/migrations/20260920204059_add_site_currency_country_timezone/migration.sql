-- CreateEnum
CREATE TYPE "SiteCurrency" AS ENUM ('USD', 'BRL', 'EUR', 'GBP', 'INR', 'CAD', 'AUD');

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "country" TEXT,
ADD COLUMN     "currency" "SiteCurrency" NOT NULL DEFAULT 'USD',
ADD COLUMN     "timezone" TEXT;
