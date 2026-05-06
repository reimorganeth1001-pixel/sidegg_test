/*
  Warnings:

  - A unique constraint covering the columns `[gameId,teamId,index]` on the table `GameEvent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `index` to the `GameEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameEvent" ADD COLUMN     "index" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GameEvent_gameId_teamId_index_key" ON "GameEvent"("gameId", "teamId", "index");
