-- CreateEnum
CREATE TYPE "TemplateStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "TemplateComplexity" AS ENUM ('SIMPLE', 'STANDARD', 'ADVANCED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SitePlaybook" ADD VALUE 'PERSONAL_BRAND';
ALTER TYPE "SitePlaybook" ADD VALUE 'PROFESSIONAL_SERVICES';

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "templateId" TEXT,
ADD COLUMN     "templateVersion" INTEGER;

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "key" "SitePlaybook" NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "primaryGoal" TEXT NOT NULL,
    "complexity" "TemplateComplexity" NOT NULL,
    "description" TEXT NOT NULL,
    "recommendedUseCase" TEXT NOT NULL,
    "isEcommerce" BOOLEAN NOT NULL DEFAULT false,
    "status" "TemplateStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "parentTemplateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplatePage" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "ctaLabel" TEXT NOT NULL,
    "hasLeadForm" BOOLEAN NOT NULL DEFAULT false,
    "seoTitlePattern" TEXT,
    "seoDescriptionPattern" TEXT,

    CONSTRAINT "TemplatePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateSection" (
    "id" TEXT NOT NULL,
    "templatePageId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "bodyPattern" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "TemplateSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Template_key_idx" ON "Template"("key");

-- CreateIndex
CREATE INDEX "Template_status_idx" ON "Template"("status");

-- CreateIndex
CREATE INDEX "TemplatePage_templateId_idx" ON "TemplatePage"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "TemplatePage_templateId_slug_key" ON "TemplatePage"("templateId", "slug");

-- CreateIndex
CREATE INDEX "TemplateSection_templatePageId_idx" ON "TemplateSection"("templatePageId");

-- CreateIndex
CREATE INDEX "Site_templateId_idx" ON "Site"("templateId");

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_parentTemplateId_fkey" FOREIGN KEY ("parentTemplateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplatePage" ADD CONSTRAINT "TemplatePage_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateSection" ADD CONSTRAINT "TemplateSection_templatePageId_fkey" FOREIGN KEY ("templatePageId") REFERENCES "TemplatePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
