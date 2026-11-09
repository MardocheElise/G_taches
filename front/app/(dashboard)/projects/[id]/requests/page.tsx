/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
useCallback,
useEffect,
useState,
} from "react";

import Link from "next/link";

import {
useParams,
} from "next/navigation";

import {
ArrowLeft,
ClipboardList,
Loader2,
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
ProjectRequests,
} from "@/components/projets/project-requests";

import {
Button,
} from "@/components/ui/button";

import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card";
import { MembreProjet } from "@/types/membre";

export default function ProjectRequestsPage() {
const params = useParams();

const { token } = useAuth();

const projectId = Number(params.id);

const [
requests,
setRequests,
] = useState<MembreProjet[]>([]);

const [loading, setLoading] =
useState(true);

const [error, setError] =
useState("");

const loadRequests =
useCallback(async () => {
     if (!token || !projectId) {
     return;
     }


     try {
     setLoading(true);
     setError("");

     const data =
          await projectsApi.getRequests(
          projectId,
          token,
          );

     setRequests(data);
     } catch (error) {
     setError(
          error instanceof Error
          ? error.message
          : "Impossible de charger les demandes.",
     );
     } finally {
     setLoading(false);
     }
}, [projectId, token]);


useEffect(() => {
loadRequests();
}, [loadRequests]);

return (
<RoleGuard
allowedRoles={["SUPER_ADMIN"]}
> <div className="mx-auto max-w-5xl space-y-6"> <div> <Button
         asChild
         variant="ghost"
         size="sm"
         className="mb-4"
       >
<Link
href={`/projects/${projectId}`}
> <ArrowLeft className="mr-2 h-4 w-4" />


          Retour au projet
        </Link>
      </Button>

      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <ClipboardList className="h-6 w-6 text-primary" />
        </div>

        <div>
          <h1 className="text-3xl font-bold">
            Demandes d&apos;intégration
          </h1>

          <p className="mt-1 text-muted-foreground">
            Gérez les demandes
            d&apos;intégration à ce projet.
          </p>
        </div>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>
          Demandes en attente
        </CardTitle>

        <CardDescription>
          {requests.length} demande(s)
          à traiter
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && (
          <ProjectRequests
            projectId={projectId}
            requests={requests}
            onUpdate={loadRequests}
          />
        )}
      </CardContent>
    </Card>
  </div>
</RoleGuard>


);
}
