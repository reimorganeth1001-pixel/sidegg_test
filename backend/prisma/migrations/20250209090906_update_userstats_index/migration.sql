/*
  Warnings:

  - A unique constraint covering the columns `[userId,gameId,teamId,gameEventIndex]` on the table `UserStats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserStats_userId_gameId_gameEventIndex_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userId_gameId_teamId_gameEventIndex_key" ON "UserStats"("userId", "gameId", "teamId", "gameEventIndex");
