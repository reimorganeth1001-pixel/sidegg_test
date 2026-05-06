/*
  Warnings:

  - The `eventScore` column on the `GameEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "created_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "EventType" ALTER COLUMN "created_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "GameEvent" ALTER COLUMN "created_at" DROP DEFAULT,
DROP COLUMN "eventScore",
ADD COLUMN     "eventScore" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "created_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserStats" ALTER COLUMN "created_at" DROP DEFAULT;
