"use client";

import {
useEffect,
useState,
} from "react";

import Link from "next/link";

import {
useParams,
} from "next/navigation";

import {
ArrowLeft,
Pencil,
} from "lucide-react";

import {
useAuth,
} from "@/components/providers/auth-provider";

import {
RoleGuard,
} from "@/components/auth/role-guard";

import {
projectsApi,
} from "@/lib/api/projects";

import {
ProjetDetail,
} from "@/types/projet";

import {
EditProjectForm,
} from "@/components/projets/edit-project-form";

import {
Button,
} from "@/components/ui/button";

export default function EditProjectPage() {
const params = useParams();

const { token } = useAuth();

const [project, setProject] =
useState<ProjetDetail | null>(null);

const [loading, setLoading] =
useState(true);

const [error, setError] =
useState("");

const id = Number(params.id);

useEffect(() => {
async function loadProject() {
if (!token || !id) {
return;
}


  try {
    setLoading(true);

    const data =
      await projectsApi.getById(
        id,
        token,
      );

    setProject(data);
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Impossible de charger le projet.",
    );
  } finally {
    setLoading(false);
  }
}

loadProject();


}, [id, token]);

return (
<RoleGuard
allowedRoles={["SUPER_ADMIN"]}
> <div className="mx-auto max-w-3xl space-y-6"> <div>
<Link
href={`/projects/${id}`}
> <Button
           variant="ghost"
           size="sm"
           className="mb-4"
         > <ArrowLeft className="mr-2 h-4 w-4" />


          Retour au projet
        </Button>
      </Link>

      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Pencil className="h-6 w-6 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            Modifier le projet
          </h1>

          <p className="text-sm text-muted-foreground">
            Modifiez les informations du projet.
          </p>
        </div>
      </div>
    </div>

    {loading && (
      <div className="flex min-h-64 items-center justify-center">
        Chargement du projet...
      </div>
    )}

    {error && (
      <div className="rounded-lg border p-6">
        <p className="font-medium">
          Une erreur est survenue
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          {error}
        </p>
      </div>
    )}

    {project && (
      <div className="rounded-lg border p-6">
        <EditProjectForm
          project={project}
        />
      </div>
    )}
  </div>
</RoleGuard>


);
}
