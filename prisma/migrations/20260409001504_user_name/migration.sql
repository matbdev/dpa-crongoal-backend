/*
  Warnings:

  - Added the required column `display_name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "display_name" TEXT NOT NULL,
ADD COLUMN     "full_name" TEXT NOT NULL;
