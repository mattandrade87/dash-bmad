/*
  Warnings:

  - You are about to drop the column `categoryId` on the `goals` table. All the data in the column will be lost.
  - You are about to drop the column `currentCents` on the `goals` table. All the data in the column will be lost.
  - You are about to drop the column `targetCents` on the `goals` table. All the data in the column will be lost.
  - Added the required column `targetAmount` to the `goals` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RecurrenceFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "GoalCategory" AS ENUM ('SAVINGS', 'EMERGENCY', 'INVESTMENT', 'PURCHASE', 'DEBT', 'VACATION', 'EDUCATION', 'OTHER');

-- AlterTable
ALTER TABLE "goals" DROP COLUMN "categoryId",
DROP COLUMN "currentCents",
DROP COLUMN "targetCents",
ADD COLUMN     "category" "GoalCategory" NOT NULL DEFAULT 'SAVINGS',
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "currentAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "targetAmount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "recurringTransactionId" TEXT;

-- CreateTable
CREATE TABLE "recurring_transactions" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL,
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "frequency" "RecurrenceFrequency" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "dayOfMonth" INTEGER,
    "dayOfWeek" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastProcessed" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recurring_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recurring_transactions_userId_isActive_idx" ON "recurring_transactions"("userId", "isActive");

-- CreateIndex
CREATE INDEX "recurring_transactions_lastProcessed_idx" ON "recurring_transactions"("lastProcessed");

-- CreateIndex
CREATE INDEX "goals_userId_idx" ON "goals"("userId");

-- CreateIndex
CREATE INDEX "goals_isCompleted_idx" ON "goals"("isCompleted");

-- CreateIndex
CREATE INDEX "goals_userId_isCompleted_idx" ON "goals"("userId", "isCompleted");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recurringTransactionId_fkey" FOREIGN KEY ("recurringTransactionId") REFERENCES "recurring_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
