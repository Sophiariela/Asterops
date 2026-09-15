-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeCustomerId" TEXT;

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "stripeProductId" TEXT,
ADD COLUMN     "stripeMonthlyPriceId" TEXT,
ADD COLUMN     "stripeAnnualPriceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
