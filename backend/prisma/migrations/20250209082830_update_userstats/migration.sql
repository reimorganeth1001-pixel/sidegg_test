/*
  Warnings:

  - Added the required column `gameEventIndex` to the `UserStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserStats" ADD COLUMN     "gameEventIndex" INTEGER NOT NULL;
