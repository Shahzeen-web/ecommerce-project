/*
  Warnings:

  - You are about to drop the column `billingAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
*/

-- Drop foreign keys
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_userId_fkey";

-- Drop indexes
DROP INDEX "Category_name_key";
DROP INDEX "User_username_key";

-- Alter Order table
ALTER TABLE "Order" 
  DROP COLUMN "billingAddress",
  DROP COLUMN "shippingAddress",
  DROP COLUMN "totalAmount",
  ADD COLUMN "total" INTEGER NOT NULL,
  DROP COLUMN "status",
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'pending';

-- Alter Product table
ALTER TABLE "Product" 
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "searchVector" tsvector;

-- Alter User table
ALTER TABLE "User" 
  DROP COLUMN "username",
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "name" TEXT NOT NULL DEFAULT 'Unnamed';

-- Drop CartItem table
DROP TABLE "CartItem";

-- ✅ Add column without GENERATED
ALTER TABLE "Product"
ALTER COLUMN "searchVector" TYPE tsvector;

-- ✅ Trigger function to auto-update searchVector
CREATE FUNCTION update_search_vector() RETURNS trigger AS $$
BEGIN
  NEW."searchVector" := to_tsvector('english', coalesce(NEW.name, '') || ' ' || coalesce(NEW.description, ''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- ✅ Trigger on INSERT or UPDATE
CREATE TRIGGER product_search_vector_trigger
BEFORE INSERT OR UPDATE ON "Product"
FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- ✅ Add GIN index
CREATE INDEX product_search_idx ON "Product" USING GIN ("searchVector");

