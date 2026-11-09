-- CreateEnum
CREATE TYPE "RoleUtilisateur" AS ENUM ('USER', 'SUPER_ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "RoleUtilisateur" NOT NULL DEFAULT 'USER';
