/*
  Warnings:

  - You are about to drop the column `description` on the `GameEvent` table. All the data in the column will be lost.
  - You are about to drop the column `eventTime` on the `GameEvent` table. All the data in the column will be lost.
  - You are about to drop the column `teamName` on the `GameEvent` table. All the data in the column will be lost.
  - Added the required column `eventScore` to the `GameEvent` table without a default value. This is not possible if the table is not empty.
  - Made the column `teamId` on table `GameEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GameEvent" DROP COLUMN "description",
DROP COLUMN "eventTime",
DROP COLUMN "teamName",
ADD COLUMN     "eventScore" TEXT NOT NULL,
ALTER COLUMN "teamId" SET NOT NULL;
