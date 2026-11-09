import { Competence } from "./competence";

export type RoleUtilisateur = "USER" | "SUPER_ADMIN";

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: RoleUtilisateur;

  createdAt?: string;
  updatedAt?: string;
}

export interface UserCompetence {
  id: number;
  userId: number;
  competenceId: number;
  competence: Competence;
}
