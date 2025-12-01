/*
  Warnings:

  - You are about to drop the column `autherId` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Tweet` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Tweet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_autherId_fkey";

-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "autherId",
DROP COLUMN "image",
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
