import { apiClient } from "@/lib/api-client";

import { User, UserCompetence } from "@/types/user";

import {
  StatutTache,
  Tache,
  TacheDependance,
} from "@/types/tache";


export interface AddUserCompetencesInput {
  competenceIds: number[];
}

export const usersApi = {
  getMe: (token: string) =>
    apiClient<User>("/users/me", {
      method: "GET",
      token,
    }),

  getMyCompetences: (token: string) =>
    apiClient<UserCompetence[]>("/users/me/competences", {
      method: "GET",
      token,
    }),

  addMyCompetences: (data: AddUserCompetencesInput, token: string) =>
    apiClient<UserCompetence[]>("/users/me/competences", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  removeMyCompetence: (competenceId: number, token: string) =>
    apiClient(`/users/me/competences/${competenceId}`, {
      method: "DELETE",
      token,
    }),

  getDependances: async (
  projetId: number,
  tacheId: number,
  token: string,
): Promise<TacheDependance[]> => {
  return apiClient<TacheDependance[]>(
    `/projets/${projetId}/taches/${tacheId}/dependances`,
    {
      method: "GET",

      token,
    },
  );
},

addDependance: async (
  projetId: number,
  tacheId: number,
  dependanceId: number,
  token: string,
): Promise<TacheDependance> => {
  return apiClient<TacheDependance>(
    `/projets/${projetId}/taches/${tacheId}/dependances`,
    {
      method: "POST",

      token,

      body: JSON.stringify(dependanceId)
    },
  );
},

removeDependance: async (
  projetId: number,
  tacheId: number,
  dependanceId: number,
  token: string,
): Promise<void> => {
  return apiClient<void>(
    `/projets/${projetId}/taches/${tacheId}/dependances/${dependanceId}`,
    {
      method: "DELETE",

      token,
    },
  );
},

changeStatut: async (
  projetId: number,
  tacheId: number,
  statut: StatutTache,
  token: string,
): Promise<Tache> => {
  return apiClient<Tache>(
    `/projets/${projetId}/taches/${tacheId}/statut`,
    {
      method: "PATCH",

      token,

      body: JSON.stringify(statut)
    },
  );
},
};
