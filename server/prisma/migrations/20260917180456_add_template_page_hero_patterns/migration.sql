/*
  Warnings:

  - Added the required column `heroHeadlinePattern` to the `TemplatePage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heroSubheadlinePattern` to the `TemplatePage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TemplatePage" ADD COLUMN     "heroHeadlinePattern" TEXT NOT NULL,
ADD COLUMN     "heroSubheadlinePattern" TEXT NOT NULL;
