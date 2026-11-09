-- AlterTable
ALTER TABLE "MembreProjet" ADD COLUMN     "competenceId" INTEGER,
ALTER COLUMN "statut" SET DEFAULT 'EN_ATTENTE';

-- AddForeignKey
ALTER TABLE "MembreProjet" ADD CONSTRAINT "MembreProjet_competenceId_fkey" FOREIGN KEY ("competenceId") REFERENCES "Competence"("id") ON DELETE SET NULL ON UPDATE CASCADE;
