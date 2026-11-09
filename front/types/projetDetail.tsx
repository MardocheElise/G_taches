import { ProjetCompetence } from "./competence";
import { MembreProjet, Projet } from "./projet";

export interface ProjetDetail extends Projet {
  competences: ProjetCompetence[];

  membres: MembreProjet[];

  _count: {
    membres: number;
    taches: number;
  };
}