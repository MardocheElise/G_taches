-- CreateEnum
CREATE TYPE "RoleProjet" AS ENUM ('MEMBRE', 'CHEF_PROJET');

-- CreateEnum
CREATE TYPE "StatutMembre" AS ENUM ('ACTIF', 'INACTIF', 'QUITTE');

-- CreateEnum
CREATE TYPE "StatutProjet" AS ENUM ('PLANIFIE', 'EN_COURS', 'TERMINE', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "PrioriteTache" AS ENUM ('BASSE', 'NORMALE', 'HAUTE', 'URGENTE');

-- CreateEnum
CREATE TYPE "StatutTache" AS ENUM ('A_FAIRE', 'EN_COURS', 'BLOQUEE', 'TERMINEE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competence" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Competence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCompetence" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "competenceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCompetence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projet" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "nombreMembresMax" INTEGER NOT NULL,
    "statut" "StatutProjet" NOT NULL DEFAULT 'PLANIFIE',
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembreProjet" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "projetId" INTEGER NOT NULL,
    "role" "RoleProjet" NOT NULL DEFAULT 'MEMBRE',
    "statut" "StatutMembre" NOT NULL DEFAULT 'ACTIF',
    "dateIntegration" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MembreProjet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjetCompetence" (
    "id" SERIAL NOT NULL,
    "projetId" INTEGER NOT NULL,
    "competenceId" INTEGER NOT NULL,
    "nombreMax" INTEGER NOT NULL,

    CONSTRAINT "ProjetCompetence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tache" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "priorite" "PrioriteTache" NOT NULL DEFAULT 'NORMALE',
    "statut" "StatutTache" NOT NULL DEFAULT 'A_FAIRE',
    "dateDebut" TIMESTAMP(3),
    "dateEcheance" TIMESTAMP(3),
    "projetId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "assigneeId" INTEGER,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TacheDependance" (
    "id" SERIAL NOT NULL,
    "tacheId" INTEGER NOT NULL,
    "dependDeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TacheDependance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Competence_nom_key" ON "Competence"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "UserCompetence_userId_competenceId_key" ON "UserCompetence"("userId", "competenceId");

-- CreateIndex
CREATE UNIQUE INDEX "MembreProjet_userId_projetId_key" ON "MembreProjet"("userId", "projetId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjetCompetence_projetId_competenceId_key" ON "ProjetCompetence"("projetId", "competenceId");

-- CreateIndex
CREATE UNIQUE INDEX "TacheDependance_tacheId_dependDeId_key" ON "TacheDependance"("tacheId", "dependDeId");

-- AddForeignKey
ALTER TABLE "UserCompetence" ADD CONSTRAINT "UserCompetence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCompetence" ADD CONSTRAINT "UserCompetence_competenceId_fkey" FOREIGN KEY ("competenceId") REFERENCES "Competence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembreProjet" ADD CONSTRAINT "MembreProjet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembreProjet" ADD CONSTRAINT "MembreProjet_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetCompetence" ADD CONSTRAINT "ProjetCompetence_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetCompetence" ADD CONSTRAINT "ProjetCompetence_competenceId_fkey" FOREIGN KEY ("competenceId") REFERENCES "Competence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tache" ADD CONSTRAINT "Tache_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tache" ADD CONSTRAINT "Tache_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tache" ADD CONSTRAINT "Tache_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tache" ADD CONSTRAINT "Tache_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Tache"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TacheDependance" ADD CONSTRAINT "TacheDependance_tacheId_fkey" FOREIGN KEY ("tacheId") REFERENCES "Tache"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TacheDependance" ADD CONSTRAINT "TacheDependance_dependDeId_fkey" FOREIGN KEY ("dependDeId") REFERENCES "Tache"("id") ON DELETE CASCADE ON UPDATE CASCADE;
