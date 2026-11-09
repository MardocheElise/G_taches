export type RoleUtilisateur = "SUPER_ADMIN" | "USER";

export interface AuthUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: RoleUtilisateur;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}
