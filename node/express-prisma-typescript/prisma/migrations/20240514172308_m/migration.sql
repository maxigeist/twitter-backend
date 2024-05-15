/*
  Warnings:

  - You are about to drop the column `conversationPicture` on the `Conversation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "conversationPicture",
ADD COLUMN     "picture" TEXT;
