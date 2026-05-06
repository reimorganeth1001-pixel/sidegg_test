/*
  Warnings:

  - Added the required column `awayTeamAbbr` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `homeTeamAbbr` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "awayTeamAbbr" TEXT NOT NULL,
ADD COLUMN     "homeTeamAbbr" TEXT NOT NULL;
