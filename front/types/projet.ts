import { Competence } from "./competence";
import { MembreProjet } from "./membre";

export type StatutProjet = "PLANIFIE" | "EN_COURS" | "TERMINE" | "ARCHIVE";

export type RoleProjet = "CHEF_PROJET" | "MEMBRE";

export type StatutMembre = "EN_ATTENTE" | "ACTIF" | "REFUSE" | "QUITTE";

export interface ProjetCount {
  membres: number;
  taches: number;
}

export interface Projet {
  id: number;
  nom: string;
  description: string | null;

  dateDebut: string;
  dateFin: string | null;

  nombreMembresMax: number;
  statut: StatutProjet;

  createdById: number;

  createdAt: string;
  updatedAt: string;

  _count: ProjetCount;
}

export interface ProjetUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

// export interface MembreProjet {
//   id: number;

//   userId: number;
//   projetId: number;
//   competenceId: number | null;

//   role: RoleProjet;
//   statut: StatutMembre;

//   dateIntegration: string;

//   user: ProjetUser;
//   competence: {
//     id: number;
//     nom: string;
//   } | null;
// }

export interface ProjetDetail extends Projet {
  membres: MembreProjet[];
  competences: ProjetCompetence[];  
  _count: {
    membres: number;
    taches: number;
  };
}
export interface DemandeProjet {
  id: number;
  userId: number;
  projetId: number;
  competenceId: number | null;
  statut: StatutMembre;
  dateIntegration: string;

  user: ProjetUser;

  competence?: Competence | null;
}

export interface ProjetCompetence {
  id: number;
  projetId: number;
  competenceId: number;
  nombreMax: number;

  competence: {
    id: number;
    nom: string;
  };
}
export type { Competence };


export type { MembreProjet };

