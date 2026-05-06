-- CreateTable
CREATE TABLE "CodeStatus" (
    "id" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CodeStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CodeStatus_code_key" ON "CodeStatus"("code");
