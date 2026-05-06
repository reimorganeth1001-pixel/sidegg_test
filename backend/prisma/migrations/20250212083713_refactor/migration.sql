/*
  Warnings:

  - A unique constraint covering the columns `[index]` on the table `GameAction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "GameAction_gameId_teamId_index_key";

-- CreateIndex
CREATE UNIQUE INDEX "GameAction_index_key" ON "GameAction"("index");
