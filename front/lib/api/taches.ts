

import {
  CreateDependanceInput,
  CreateTacheInput,
  Tache,
  TacheDependance,
  UpdateStatutTacheInput,
  UpdateTacheInput,
} from "@/types/tache";
import { apiClient } from "../api-client";

export const tachesApi = {
  getAll: (
    projetId: number,
    token: string,
  ) =>
    apiClient<Tache[]>(
      `/projets/${projetId}/taches`,
      {
        method: "GET",
        token,
      },
    ),

  getById: (
    projetId: number,
    tacheId: number,
    token: string,
  ) =>
    apiClient<Tache>(
      `/projets/${projetId}/taches/${tacheId}`,
      {
        method: "GET",
        token,
      },
    ),

  create: (
    projetId: number,
    data: CreateTacheInput,
    token: string,
  ) =>
    apiClient<Tache>(
      `/projets/${projetId}/taches`,
      {
        method: "POST",
        token,
        body: JSON.stringify(data),
      },
    ),

  update: (
    projetId: number,
    tacheId: number,
    data: UpdateTacheInput,
    token: string,
  ) =>
    apiClient<Tache>(
      `/projets/${projetId}/taches/${tacheId}`,
      {
        method: "PATCH",
        token,
        body: JSON.stringify(data),
      },
    ),

  remove: (
    projetId: number,
    tacheId: number,
    token: string,
  ) =>
    apiClient(
      `/projets/${projetId}/taches/${tacheId}`,
      {
        method: "DELETE",
        token,
      },
    ),

  changeStatut: (
    projetId: number,
    tacheId: number,
    data: UpdateStatutTacheInput,
    token: string,
  ) =>
    apiClient<Tache>(
      `/projets/${projetId}/taches/${tacheId}/statut`,
      {
        method: "PATCH",
        token,
        body: JSON.stringify(data),
      },
    ),

  getDependances: (
    projetId: number,
    tacheId: number,
    token: string,
  ) =>
    apiClient<TacheDependance[]>(
      `/projets/${projetId}/taches/${tacheId}/dependances`,
      {
        method: "GET",
        token,
      },
    ),

  addDependance: (
    projetId: number,
    tacheId: number,
    data: CreateDependanceInput,
    token: string,
  ) =>
    apiClient(
      `/projets/${projetId}/taches/${tacheId}/dependances`,
      {
        method: "POST",
        token,
        body: JSON.stringify(data),
      },
    ),

  removeDependance: (
    projetId: number,
    tacheId: number,
    dependanceId: number,
    token: string,
  ) =>
    apiClient(
      `/projets/${projetId}/taches/${tacheId}/dependances/${dependanceId}`,
      {
        method: "DELETE",
        token,
      },
    ),
};