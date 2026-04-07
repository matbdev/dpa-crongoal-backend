-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('RECURRENT', 'UNIQUE');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "google_id" TEXT,
    "email" TEXT NOT NULL,
    "pic_url" TEXT,
    "hash_password" TEXT,
    "points_balance" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reward" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "points_to_get" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redeem_history" (
    "id" TEXT NOT NULL,
    "redeem_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "spent_points" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "reward_id" TEXT NOT NULL,

    CONSTRAINT "redeem_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "limit_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "TaskType" NOT NULL DEFAULT 'RECURRENT',
    "generated_points" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "project_id" TEXT,
    "column_id" TEXT,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routine_task" (
    "routine_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,

    CONSTRAINT "routine_task_pkey" PRIMARY KEY ("routine_id","task_id")
);

-- CreateTable
CREATE TABLE "daily_register" (
    "id" TEXT NOT NULL,
    "register_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_done" BOOLEAN NOT NULL DEFAULT false,
    "obs" TEXT,
    "task_id" TEXT NOT NULL,

    CONSTRAINT "daily_register_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kanban_column" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "kanban_column_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "reward_user_id_title_key" ON "reward"("user_id", "title");

-- CreateIndex
CREATE UNIQUE INDEX "routine_user_id_name_key" ON "routine"("user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "project_user_id_title_key" ON "project"("user_id", "title");

-- CreateIndex
CREATE UNIQUE INDEX "task_project_id_title_key" ON "task"("project_id", "title");

-- CreateIndex
CREATE UNIQUE INDEX "kanban_column_project_id_name_key" ON "kanban_column"("project_id", "name");

-- AddForeignKey
ALTER TABLE "reward" ADD CONSTRAINT "reward_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redeem_history" ADD CONSTRAINT "redeem_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redeem_history" ADD CONSTRAINT "redeem_history_reward_id_fkey" FOREIGN KEY ("reward_id") REFERENCES "reward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine" ADD CONSTRAINT "routine_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_column_id_fkey" FOREIGN KEY ("column_id") REFERENCES "kanban_column"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine_task" ADD CONSTRAINT "routine_task_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routine_task" ADD CONSTRAINT "routine_task_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_register" ADD CONSTRAINT "daily_register_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kanban_column" ADD CONSTRAINT "kanban_column_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
