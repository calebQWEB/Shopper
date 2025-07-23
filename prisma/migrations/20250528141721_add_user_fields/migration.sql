/*
  Warnings:

  - A unique constraint covering the columns `[customerCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "customerCode" DROP NOT NULL,
ALTER COLUMN "customerCode" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "User_customerCode_key" ON "User"("customerCode");
