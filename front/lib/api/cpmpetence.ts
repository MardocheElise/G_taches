import { apiClient } from "@/lib/api-client";

import { Competence } from "@/types/projet";

export const competencesApi = {
  getAll: (token: string) =>
    apiClient<Competence[]>("/competences", {
      method: "GET",
      token,
    }),
};
