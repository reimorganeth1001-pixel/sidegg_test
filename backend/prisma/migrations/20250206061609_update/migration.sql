/*
  Warnings:

  - Added the required column `awayTeamName` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `homeTeamName` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "awayTeamName" TEXT NOT NULL,
ADD COLUMN     "homeTeamName" TEXT NOT NULL;
