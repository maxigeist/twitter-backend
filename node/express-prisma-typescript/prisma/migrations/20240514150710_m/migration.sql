/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `ProfileType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProfileType_type_key" ON "ProfileType"("type");
