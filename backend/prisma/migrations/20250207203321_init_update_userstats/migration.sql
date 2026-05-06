/*
  Warnings:

  - A unique constraint covering the columns `[userId,gameId]` on the table `UserStats` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "score" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userId_gameId_key" ON "UserStats"("userId", "gameId");
