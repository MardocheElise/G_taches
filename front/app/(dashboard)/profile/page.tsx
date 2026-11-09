"use client";

import {
  User,
  BriefcaseBusiness,
  Mail,
  Shield,
} from "lucide-react";

import {
  useAuth,
} from "@/components/providers/auth-provider";

 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCompetences } from "@/components/user/user-competences";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* EN-TÊTE */}
      <div>
        <h1 className="text-3xl font-bold">
          Mon profil
        </h1>

        <p className="mt-1 text-muted-foreground">
          Gérez vos informations et vos compétences.
        </p>
      </div>

      {/* INFORMATIONS */}
      <Card>
        <CardHeader>
          <CardTitle>
            Informations personnelles
          </CardTitle>

          <CardDescription>
            Informations associées à votre compte.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-3">
              <User className="h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Nom complet
                </p>

                <p className="font-medium">
                  {user.prenom} {user.nom}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Email
                </p>

                <p className="font-medium">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Rôle
                </p>

                <p className="font-medium">
                  {user.role === "SUPER_ADMIN"
                    ? "Super administrateur"
                    : "Utilisateur"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* COMPÉTENCES */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BriefcaseBusiness className="h-5 w-5" />

            <div>
              <CardTitle>
                Mes compétences
              </CardTitle>

              <CardDescription>
                Ajoutez les compétences que vous pouvez utiliser
                dans les projets.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <UserCompetences />
        </CardContent>
      </Card>
    </div>
  );
}