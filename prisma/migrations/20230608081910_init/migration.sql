/*
  Warnings:

  - The `image` column on the `category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `address_id` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `SKU` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `UPC` on the `product` table. All the data in the column will be lost.
  - Added the required column `weight` to the `cart_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_address` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_country` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_address_id_fkey";

-- AlterTable
ALTER TABLE "address" ALTER COLUMN "country" SET DEFAULT 'FR';

-- AlterTable
ALTER TABLE "auth_user" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "weight" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "category" DROP COLUMN "image",
ADD COLUMN     "image" JSONB;

-- AlterTable
ALTER TABLE "order" DROP COLUMN "address_id",
ADD COLUMN     "client_address" TEXT NOT NULL,
ADD COLUMN     "client_country" TEXT NOT NULL,
ADD COLUMN     "tax_cost" DECIMAL(10,2),
ADD COLUMN     "weight" INTEGER,
ALTER COLUMN "client_email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "SKU",
DROP COLUMN "UPC",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "gst" INTEGER DEFAULT 3,
ADD COLUMN     "meta_desc" TEXT,
ADD COLUMN     "meta_title" TEXT,
ADD COLUMN     "popularity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "upc" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "weight" INTEGER,
ALTER COLUMN "min_qty" SET DEFAULT 1;
