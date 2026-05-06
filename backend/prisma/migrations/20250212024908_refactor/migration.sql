/*
  Warnings:

  - Added the required column `city` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortName` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "logo" TEXT NOT NULL,
ADD COLUMN     "shortName" TEXT NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;
