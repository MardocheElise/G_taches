/*
  Warnings:

  - You are about to drop the column `dependDeId` on the `TacheDependance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tacheId,dependanceId]` on the table `TacheDependance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dependanceId` to the `TacheDependance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tache" DROP CONSTRAINT "Tache_parentId_fkey";

-- DropForeignKey
ALTER TABLE "TacheDependance" DROP CONSTRAINT "TacheDependance_dependDeId_fkey";

-- DropIndex
DROP INDEX "TacheDependance_tacheId_dependDeId_key";

-- AlterTable
ALTER TABLE "TacheDependance" DROP COLUMN "dependDeId",
ADD COLUMN     "dependanceId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Tache_projetId_idx" ON "Tache"("projetId");

-- CreateIndex
CREATE INDEX "Tache_createdById_idx" ON "Tache"("createdById");

-- CreateIndex
CREATE INDEX "Tache_assigneeId_idx" ON "Tache"("assigneeId");

-- CreateIndex
CREATE INDEX "Tache_parentId_idx" ON "Tache"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "TacheDependance_tacheId_dependanceId_key" ON "TacheDependance"("tacheId", "dependanceId");

-- AddForeignKey
ALTER TABLE "Tache" ADD CONSTRAINT "Tache_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Tache"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TacheDependance" ADD CONSTRAINT "TacheDependance_dependanceId_fkey" FOREIGN KEY ("dependanceId") REFERENCES "Tache"("id") ON DELETE CASCADE ON UPDATE CASCADE;
