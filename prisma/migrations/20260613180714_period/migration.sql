-- CreateEnum
CREATE TYPE "RoutinePeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL');

-- AlterTable
ALTER TABLE "routine" ADD COLUMN     "period" "RoutinePeriod" NOT NULL DEFAULT 'DAILY';
