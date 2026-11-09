// import { User } from "./user";

// export type PrioriteTache = "BASSE" | "NORMALE" | "HAUTE" | "URGENTE";

// export type StatutTache = "A_FAIRE" | "EN_COURS" | "BLOQUEE" | "TERMINEE";

// export interface Tache {
//   id: number;

//   titre: string;
//   description?: string | null;

//   priorite: PrioriteTache;
//   statut: StatutTache;

//   dateDebut?: string | null;
//   dateEcheance?: string | null;

//   projetId: number;

//   createdById: number;
//   assigneeId?: number | null;

//   parentId?: number | null;

//   createdBy?: User;
//   assignee?: User | null;

//   sousTaches?: Tache[];

//   createdAt: string;
//   updatedAt: string;
// }

// export interface TacheDependance {
//   id: number;

//   tacheId: number;
//   dependanceId: number;

//   tache?: Tache;
//   dependance?: Tache;

//   createdAt: string;
// }


// export interface CreateTacheInput {
//   titre: string;

//   description?: string;

//   priorite?: PrioriteTache;

//   statut?: StatutTache;

//   dateDebut?: string;

//   dateEcheance?: string;

//   assigneeId?: number;

//   parentId?: number;
// }

// export interface UpdateTacheInput {
//   titre?: string;

//   description?: string;

//   priorite?: PrioriteTache;

//   statut?: StatutTache;

//   dateDebut?: string;

//   dateEcheance?: string;

//   assigneeId?: number | null;

//   parentId?: number | null;
// }

// export interface UpdateStatutTacheInput {
//   statut: StatutTache;
// }

// export interface CreateDependanceInput {
//   dependanceId: number;
// }













export type StatutTache =
  | "A_FAIRE"
  | "EN_COURS"
  | "TERMINEE";

export type PrioriteTache =
  | "BASSE"
  | "NORMALE"
  | "HAUTE"
  | "URGENTE";

export interface TacheUser {
  id: number;
  nom: string;
  prenom: string;
  email?: string;
}

export interface Tache {
  id: number;

  titre: string;

  description: string | null;

  priorite: PrioriteTache;

  statut: StatutTache;

  dateDebut: string | null;

  dateEcheance: string | null;

  projetId: number;

  createdById: number;

  assigneeId: number | null;

  parentId: number | null;

  createdAt: string;

  updatedAt: string;

  createdBy?: TacheUser;

  assignee?: TacheUser | null;

  sousTaches?: Tache[];
}

export interface CreateTacheInput {
  titre: string;

  description?: string;

  priorite?: PrioriteTache;

  dateDebut?: string;

  dateEcheance?: string;

  assigneeId?: number;

  parentId?: number;
}

export interface UpdateTacheInput {
  titre?: string;

  description?: string;

  priorite?: PrioriteTache;

  statut?: StatutTache;

  dateEcheance?: string;

  assigneeId?: number;
}

export interface UpdateStatutTacheInput {
  statut: StatutTache;
}

export interface CreateDependanceInput {
  dependanceId: number;
}

export interface TacheDependance {
  id: number;

  tacheId: number;

  dependanceId: number;

  dependance: {
    id: number;

    titre: string;

    statut: StatutTache;

    priorite: PrioriteTache;

    dateEcheance: string | null;
  };
}