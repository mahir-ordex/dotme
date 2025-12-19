/*
  Warnings:

  - Added the required column `paymentId` to the `PremiumSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PremiumSubscription" ADD COLUMN     "paymentId" TEXT NOT NULL;
