/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Merchant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Merchant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Merchant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Merchant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `Merchant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Merchant" DROP COLUMN "createdAt",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "updatedBy" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_email_key" ON "Merchant"("email");
