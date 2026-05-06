/*
  Warnings:

  - You are about to drop the column `actionId` on the `UserStats` table. All the data in the column will be lost.
  - You are about to drop the column `actionIndex` on the `UserStats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameActionId]` on the table `UserStats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameActionId` to the `UserStats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserStats" DROP CONSTRAINT "UserStats_actionId_fkey";

-- DropIndex
DROP INDEX "UserStats_userId_gameId_teamId_actionIndex_key";

-- AlterTable
ALTER TABLE "UserStats" DROP COLUMN "actionId",
DROP COLUMN "actionIndex",
ADD COLUMN     "gameActionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_gameActionId_key" ON "UserStats"("gameActionId");

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_gameActionId_fkey" FOREIGN KEY ("gameActionId") REFERENCES "GameAction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
