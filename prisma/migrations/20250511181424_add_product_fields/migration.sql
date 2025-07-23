-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "restockDate" TIMESTAMP(3),
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "tax" DOUBLE PRECISION;
