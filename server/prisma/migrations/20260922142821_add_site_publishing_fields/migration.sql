-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "customDomain" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Site_slug_key" ON "Site"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Site_customDomain_key" ON "Site"("customDomain");
