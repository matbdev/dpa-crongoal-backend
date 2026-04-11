-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('DARK', 'LIGHT');

-- AlterTable
ALTER TABLE "kanban_column" ADD COLUMN     "color" TEXT DEFAULT '#20557dff';

-- AlterTable
ALTER TABLE "reward" ADD COLUMN     "description" TEXT,
ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "provider" TEXT,
ADD COLUMN     "theme" "Theme" NOT NULL DEFAULT 'DARK',
ALTER COLUMN "display_name" DROP NOT NULL;
