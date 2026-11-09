import { apiClient } from "@/lib/api-client";
import { User } from "@/types/user";

export interface LoginPayload {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterPayload {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}


export const authApi = {
  login: (data: LoginPayload) =>
    apiClient<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

 register: (data: RegisterPayload) =>
    apiClient<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
