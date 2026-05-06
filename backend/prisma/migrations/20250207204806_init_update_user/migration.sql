/*
  Warnings:

  - A unique constraint covering the columns `[emailAddr]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[twitterAccount]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[emailAddr,twitterAccount,phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "emailAddr" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL,
ALTER COLUMN "twitterAccount" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_emailAddr_key" ON "User"("emailAddr");

-- CreateIndex
CREATE UNIQUE INDEX "User_twitterAccount_key" ON "User"("twitterAccount");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_emailAddr_twitterAccount_phoneNumber_key" ON "User"("emailAddr", "twitterAccount", "phoneNumber");
