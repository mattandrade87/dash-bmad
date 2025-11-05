-- CreateTable
CREATE TABLE "contributions" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contributions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contributions_goalId_idx" ON "contributions"("goalId");

-- CreateIndex
CREATE INDEX "contributions_goalId_createdAt_idx" ON "contributions"("goalId", "createdAt");

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
