/*
  Warnings:

  - You are about to drop the column `profilePicure` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profilePicure",
ADD COLUMN     "profilePicture" TEXT;
