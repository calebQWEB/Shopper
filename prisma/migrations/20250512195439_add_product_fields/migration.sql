/*
  Warnings:

  - The `tags` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tax` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "tags",
ADD COLUMN     "tags" JSONB,
DROP COLUMN "tax",
ADD COLUMN     "tax" BOOLEAN;
