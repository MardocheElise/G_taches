import { User } from "./user";
import { Competence } from "./competence";

export type RoleProjet = "MEMBRE" | "CHEF_PROJET";

export type StatutMembre = "EN_ATTENTE" | "ACTIF" | "REFUSE" | "QUITTE";

export interface MembreProjet {
  id: number;
  userId: number;
  projetId: number;
  competenceId: number | null;
  role: RoleProjet;
  statut: StatutMembre;
  dateIntegration: string;
  user?: User;
  competence?: Competence | null;
}
