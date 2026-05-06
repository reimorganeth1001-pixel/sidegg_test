/*
  Warnings:

  - You are about to drop the column `index` on the `GameAction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `GameAction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "GameAction_index_key";

-- AlterTable
ALTER TABLE "GameAction" DROP COLUMN "index";

-- CreateIndex
CREATE UNIQUE INDEX "GameAction_id_key" ON "GameAction"("id");
