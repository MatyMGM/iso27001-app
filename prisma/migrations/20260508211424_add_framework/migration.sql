-- CreateEnum
CREATE TYPE "AssessmentFramework" AS ENUM ('iso27001', 'soc2', 'cis');

-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "framework" "AssessmentFramework" NOT NULL DEFAULT 'iso27001';

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "framework" "AssessmentFramework" NOT NULL DEFAULT 'iso27001';

-- CreateIndex
CREATE INDEX "Assessment_framework_idx" ON "Assessment"("framework");

-- CreateIndex
CREATE INDEX "Question_framework_idx" ON "Question"("framework");
