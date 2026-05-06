/*
  Warnings:

  - You are about to drop the column `awayScore` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `awayTeamAbbr` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `awayTeamName` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `homeScore` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `homeTeamAbbr` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `homeTeamName` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `eventType` on the `UserStats` table. All the data in the column will be lost.
  - You are about to drop the column `gameEventIndex` on the `UserStats` table. All the data in the column will be lost.
  - You are about to drop the `EventType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameEvent` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,gameId,teamId,actionIndex]` on the table `UserStats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `actionId` to the `UserStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actionIndex` to the `UserStats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GameEvent" DROP CONSTRAINT "GameEvent_eventType_fkey";

-- DropForeignKey
ALTER TABLE "GameEvent" DROP CONSTRAINT "GameEvent_gameId_fkey";

-- DropForeignKey
ALTER TABLE "UserStats" DROP CONSTRAINT "UserStats_eventType_fkey";

-- DropIndex
DROP INDEX "UserStats_userId_gameId_teamId_gameEventIndex_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "awayScore",
DROP COLUMN "awayTeamAbbr",
DROP COLUMN "awayTeamName",
DROP COLUMN "homeScore",
DROP COLUMN "homeTeamAbbr",
DROP COLUMN "homeTeamName",
ALTER COLUMN "lastUpdated" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserStats" DROP COLUMN "eventType",
DROP COLUMN "gameEventIndex",
ADD COLUMN     "actionId" TEXT NOT NULL,
ADD COLUMN     "actionIndex" INTEGER NOT NULL;

-- DropTable
DROP TABLE "EventType";

-- DropTable
DROP TABLE "GameEvent";

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbbreviation" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "shortDisplayName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionType" (
    "id" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "pointsValue" INTEGER NOT NULL,
    "quantityValue" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameAction" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "clock" TEXT NOT NULL,
    "wallClock" TIMESTAMP(3) NOT NULL,
    "scoreValue" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_id_key" ON "Team"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ActionType_id_key" ON "ActionType"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ActionType_actionType_key" ON "ActionType"("actionType");

-- CreateIndex
CREATE UNIQUE INDEX "GameAction_gameId_teamId_index_key" ON "GameAction"("gameId", "teamId", "index");

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userId_gameId_teamId_actionIndex_key" ON "UserStats"("userId", "gameId", "teamId", "actionIndex");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAction" ADD CONSTRAINT "GameAction_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAction" ADD CONSTRAINT "GameAction_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("gameId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAction" ADD CONSTRAINT "GameAction_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "ActionType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "ActionType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
