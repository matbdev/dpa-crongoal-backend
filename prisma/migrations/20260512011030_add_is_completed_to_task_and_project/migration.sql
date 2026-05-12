-- AlterTable
ALTER TABLE "project" ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false;
