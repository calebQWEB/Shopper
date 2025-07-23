-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('active', 'draft', 'hidden');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "length" DOUBLE PRECISION,
ADD COLUMN     "publishedDate" TIMESTAMP(3),
ADD COLUMN     "seoDescription" VARCHAR(160),
ADD COLUMN     "title" VARCHAR(60),
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'active',
ADD COLUMN     "weight" DOUBLE PRECISION,
ADD COLUMN     "width" DOUBLE PRECISION;
