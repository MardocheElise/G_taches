"use client";

import Link from "next/link";

import {
FolderKanban,
Sparkles,
} from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";

import {
Card,
CardContent,
CardHeader,
CardTitle,
} from "@/components/ui/card";

import {
Button,
} from "@/components/ui/button";

export function UserDashboard() {
const { user } = useAuth();

return ( <div className="space-y-6"> <div> <h1 className="text-2xl font-bold">
Bonjour {user?.prenom} 👋 </h1>


    <p className="mt-1 text-muted-foreground">
      Bienvenue dans votre espace de gestion de projets.
    </p>
  </div>

  <div className="grid gap-6 md:grid-cols-2">
    <Card>
      <CardHeader>
        <FolderKanban className="h-8 w-8 text-muted-foreground" />

        <CardTitle className="mt-3">
          Explorer les projets
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Consultez les projets disponibles et rejoignez
          ceux qui correspondent à vos compétences.
        </p>

        <Button asChild>
          <Link href="/projects">
            Voir les projets
          </Link>
        </Button>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <Sparkles className="h-8 w-8 text-muted-foreground" />

        <CardTitle className="mt-3">
          Mes compétences
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Complétez votre profil en ajoutant vos
          compétences professionnelles.
        </p>

        <Button
          asChild
          variant="outline"
        >
          <Link href="/competences">
            Gérer mes compétences
          </Link>
        </Button>
      </CardContent>
    </Card>
  </div>
</div>


);
}
