-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "benchmarkConsent" BOOLEAN,
ADD COLUMN     "computedScore" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "Assessment_benchmarkConsent_idx" ON "Assessment"("benchmarkConsent");
