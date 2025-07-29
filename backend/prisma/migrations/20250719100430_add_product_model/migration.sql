/*
  Warnings:

  - You are about to drop the column `createdAt` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Product` table. All the data in the column will be lost.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CartItem_productId_idx";

-- DropIndex
DROP INDEX "CartItem_userId_idx";

-- DropIndex
DROP INDEX "Order_userId_idx";

-- DropIndex
DROP INDEX "OrderItem_orderId_idx";

-- DropIndex
DROP INDEX "OrderItem_productId_idx";

-- DropIndex
DROP INDEX "Product_categoryId_idx";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "updatedAt",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "imageUrl",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[];
