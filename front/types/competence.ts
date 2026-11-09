export interface Competence {
  id: number;
  nom: string;
  createdAt: string;
}

export interface ProjetCompetence {
  id: number;
  projetId: number;
  competenceId: number;
  nombreMax: number;
  competence: Competence;
}
