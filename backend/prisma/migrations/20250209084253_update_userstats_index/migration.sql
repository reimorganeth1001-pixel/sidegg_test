/*
  Warnings:

  - A unique constraint covering the columns `[gameId,teamId]` on the table `GameEvent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,gameId,gameEventIndex]` on the table `UserStats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GameEvent_gameId_teamId_key" ON "GameEvent"("gameId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userId_gameId_gameEventIndex_key" ON "UserStats"("userId", "gameId", "gameEventIndex");
