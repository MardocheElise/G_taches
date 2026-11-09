import { StatutProjet } from "./projet";

export interface DashboardStatistiques {
  totalProjets: number;
  projetsPlanifies: number;
  projetsEnCours: number;
  projetsTermines: number;
  projetsArchives: number;
  totalUtilisateurs: number;
}

export interface ProjetParStatut {
  statut: StatutProjet;
  nombre: number;
}

export interface DernierProjet {
  id: number;
  nom: string;
  description: string | null;
  dateDebut: string;
  dateFin: string | null;
  nombreMembresMax: number;
  statut: StatutProjet;
  createdAt: string;
  updatedAt: string;

  createdBy: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };

  _count: {
    membres: number;
    taches: number;
  };
}

export interface DashboardData {
  statistiques: DashboardStatistiques;
  projetsParStatut: ProjetParStatut[];
  derniersProjets: DernierProjet[];
}
