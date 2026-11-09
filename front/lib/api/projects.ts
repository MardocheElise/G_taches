/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiClient } from "@/lib/api-client";
import { ProjetCompetence } from "@/types/competence";
import { MembreProjet } from "@/types/membre";

import { DemandeProjet, Projet, ProjetDetail } from "@/types/projet";

export interface CreateProjectInput {
  nom: string;
  description?: string;
  dateDebut: string;
  dateFin?: string;
  nombreMembresMax: number;
}

export interface UpdateProjectInput {
  nom?: string;
  description?: string;
  dateDebut?: string;
  dateFin?: string;
  nombreMembresMax?: number;
}

export interface AddProjetCompetenceInput {
  competenceId: number;
  nombreMax: number;
}

export interface UpdateProjetCompetenceInput {
  nombreMax: number;
}

export interface RejoindreProjetInput {
  competenceId: number;
}

export interface JoinProjectInput {
  competenceId: number;
}
export const projectsApi = {
  getAll: (token: string) =>
    apiClient<Projet[]>("/projets", {
      method: "GET",
      token,
    }),

  getById: (id: number, token: string) =>
    apiClient<ProjetDetail>(`/projets/${id}`, {
      method: "GET",
      token, 
    }),

  create: (data: CreateProjectInput, token: string) =>
    apiClient<Projet>("/projets", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateProjectInput, token: string) =>
    apiClient<Projet>(`/projets/${id}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(data),
    }),

  remove: (id: number, token: string) =>
    apiClient<{ message: string }>(`/projets/${id}`, {
      method: "DELETE",
      token,
    }),

  addCompetence: (
    projectId: number,
    data: AddProjetCompetenceInput,
    token: string,
  ) =>
    apiClient<ProjetCompetence>(`/projets/${projectId}/competences`, {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  updateCompetence: (
    projectId: number,
    competenceId: number,
    data: UpdateProjetCompetenceInput,
    token: string,
  ) =>
    apiClient<ProjetCompetence>(
      `/projets/${projectId}/competences/${competenceId}`,
      {
        method: "PATCH",
        token,
        body: JSON.stringify(data),
      },
    ),

  removeCompetence: (projectId: number, competenceId: number, token: string) =>
    apiClient<void>(`/projets/${projectId}/competences/${competenceId}`, {
      method: "DELETE",
      token,
    }),

  join: (projectId: number, data: JoinProjectInput, token: string) =>
    apiClient(`/projets/${projectId}/rejoindre`, {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  getRequests: (projectId: number, token: string) =>
    apiClient<MembreProjet[]>(`/projets/${projectId}/demandes`, {
      method: "GET",
      token,
    }),

  acceptMember: (projectId: number, memberId: number, token: string) =>
    apiClient<MembreProjet>(
      `/projets/${projectId}/membres/${memberId}/accepter`,
      {
        method: "PATCH",
        token,
      },
    ),

  refuseMember: (projectId: number, memberId: number, token: string) =>
    apiClient<MembreProjet>(
      `/projets/${projectId}/membres/${memberId}/refuser`,
      {
        method: "PATCH",
        token,
      },
    ),

  getMembers: (
      projectId: number,
      token: string,
    ) =>
      apiClient<MembreProjet[]>(
        `/projets/${projectId}/membres`,
        {
          method: "GET",
          token,
        },
      ),

    getMember: (
      projectId: number,
      memberId: number,
      token: string,
    ) =>
      apiClient<MembreProjet>(
        `/projets/${projectId}/membres/${memberId}`,
        {
          method: "GET",
          token,
        },
      ),

designateProjectManager: (
  projectId: number,
  memberId: number,
  token: string,
) =>
  apiClient(
    `/projets/${projectId}/chef/${memberId}`,
    {
      method: "PATCH",
      token,
    },
  ),

changeProjectManager: (
  projectId: number,
  memberId: number,
  token: string,
) =>
  apiClient(
    `/projets/${projectId}/chef`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(memberId)
    },
  ),

  removeMember: (
    projectId: number,
    memberId: number,
    token: string,
  ) =>
    apiClient(
      `/projets/${projectId}/membres/${memberId}`,
      {
        method: "DELETE",
        token,
      },
    ),
  // // =========================
  // // COMPÉTENCES
  // // =========================

  // getCompetences: (projetId: number, token: string) =>
  //   apiClient<ProjetCompetence[]>(`/projets/${projetId}/competences`, {
  //     method: "GET",
  //     token,
  //   }),

  // addCompetence: (
  //   projetId: number,
  //   data: AddProjetCompetenceInput,
  //   token: string,
  // ) =>
  //   apiClient<ProjetCompetence>(`/projets/${projetId}/competences`, {
  //     method: "POST",
  //     token,
  //     body: JSON.stringify(data),
  //   }),

  // updateCompetence: (
  //   projetId: number,
  //   competenceId: number,
  //   data: UpdateProjetCompetenceInput,
  //   token: string,
  // ) =>
  //   apiClient<ProjetCompetence>(
  //     `/projets/${projetId}/competences/${competenceId}`,
  //     {
  //       method: "PATCH",
  //       token,
  //       body: JSON.stringify(data),
  //     },
  //   ),

  // removeCompetence: (projetId: number, competenceId: number, token: string) =>
  //   apiClient<{ message: string }>(
  //     `/projets/${projetId}/competences/${competenceId}`,
  //     {
  //       method: "DELETE",
  //       token,
  //     },
  //   ),

  // // =========================
  // // DEMANDES
  // // =========================

  // getDemandes: (projetId: number, token: string) =>
  //   apiClient<DemandeProjet[]>(`/projets/${projetId}/demandes`, {
  //     method: "GET",
  //     token,
  //   }),

  // accepterMembre: (projetId: number, membreId: number, token: string) =>
  //   apiClient<MembreProjet>(
  //     `/projets/${projetId}/membres/${membreId}/accepter`,
  //     {
  //       method: "PATCH",
  //       token,
  //     },
  //   ),

  // refuserMembre: (projetId: number, membreId: number, token: string) =>
  //   apiClient<MembreProjet>(
  //     `/projets/${projetId}/membres/${membreId}/refuser`,
  //     {
  //       method: "PATCH",
  //       token,
  //     },
  //   ),

  // // =========================
  // // MEMBRES
  // // =========================

  // getMembres: (projetId: number, token: string) =>
  //   apiClient<MembreProjet[]>(`/projets/${projetId}/membres`, {
  //     method: "GET",
  //     token,
  //   }),

  // getMembre: (projetId: number, membreId: number, token: string) =>
  //   apiClient<MembreProjet>(`/projets/${projetId}/membres/${membreId}`, {
  //     method: "GET",
  //     token,
  //   }),

  // rejoindre: (projetId: number, data: RejoindreProjetInput, token: string) =>
  //   apiClient<MembreProjet>(`/projets/${projetId}/rejoindre`, {
  //     method: "POST",
  //     token,
  //     body: JSON.stringify(data),
  //   }),

  // designerChef: (projetId: number, membreId: number, token: string) =>
  //   apiClient<MembreProjet>(`/projets/${projetId}/chef/${membreId}`, {
  //     method: "PATCH",
  //     token,
  //   }),

  // changerChef: (projetId: number, membreId: number, token: string) =>
  //   apiClient<MembreProjet>(`/projets/${projetId}/chef`, {
  //     method: "PATCH",
  //     token,
  //     body: JSON.stringify({
  //       membreId,
  //     }),
  //   }),

  // retirerMembre: (projetId: number, membreId: number, token: string) =>
  //   apiClient<MembreProjet>(`/projets/${projetId}/membres/${membreId}`, {
  //     method: "DELETE",
  //     token,
  //   }),
};
