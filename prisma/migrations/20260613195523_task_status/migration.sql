-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'TODO';
