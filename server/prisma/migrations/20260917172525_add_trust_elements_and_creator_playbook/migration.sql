-- CreateEnum
CREATE TYPE "TrustElementType" AS ENUM ('CASE_STUDY', 'CLIENT_LOGO', 'CERTIFICATION');

-- AlterEnum
ALTER TYPE "SitePlaybook" ADD VALUE 'CREATOR';

-- CreateTable
CREATE TABLE "TrustElement" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "type" "TrustElementType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrustElement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrustElement_siteId_idx" ON "TrustElement"("siteId");

-- AddForeignKey
ALTER TABLE "TrustElement" ADD CONSTRAINT "TrustElement_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
