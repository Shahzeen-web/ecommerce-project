/*
  Warnings:

  - The values [PROCESSING] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `userId` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `orderId` on the `OrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "orderId",
ADD COLUMN     "orderId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "name",
ADD COLUMN     "username" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
