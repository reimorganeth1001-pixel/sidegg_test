-- AlterTable
ALTER TABLE "ActionType" ADD COLUMN     "quantityValueSucc" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "pointsValue" SET DEFAULT 0,
ALTER COLUMN "quantityValue" SET DEFAULT 0;
