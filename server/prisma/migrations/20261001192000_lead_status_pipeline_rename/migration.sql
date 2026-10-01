-- Renames the Lead pipeline stages (NEW/CONTACTED/QUALIFIED/CLOSED ->
-- LEAD/CONSULTATION/PROPOSAL/CLIENT). Existing rows are remapped by value,
-- not cast by position, so data is preserved exactly.
BEGIN;

CREATE TYPE "LeadStatus_new" AS ENUM ('LEAD', 'CONSULTATION', 'PROPOSAL', 'CLIENT');

ALTER TABLE "Lead" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Lead" ALTER COLUMN "status" TYPE "LeadStatus_new" USING (
  CASE "status"::text
    WHEN 'NEW' THEN 'LEAD'
    WHEN 'CONTACTED' THEN 'CONSULTATION'
    WHEN 'QUALIFIED' THEN 'PROPOSAL'
    WHEN 'CLOSED' THEN 'CLIENT'
  END::"LeadStatus_new"
);

ALTER TYPE "LeadStatus" RENAME TO "LeadStatus_old";
ALTER TYPE "LeadStatus_new" RENAME TO "LeadStatus";
DROP TYPE "LeadStatus_old";

ALTER TABLE "Lead" ALTER COLUMN "status" SET DEFAULT 'LEAD';

COMMIT;
