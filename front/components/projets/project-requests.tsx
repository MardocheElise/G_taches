"use client";

import { useState } from "react";

import {
Check,
Loader2,
Mail,
UserRound,
X,
} from "lucide-react";


import {
projectsApi,
} from "@/lib/api/projects";

import {
useAuth,
} from "@/components/providers/auth-provider";

import {
Button,
} from "@/components/ui/button";
import { MembreProjet } from "@/types/membre";

interface ProjectRequestsProps {
projectId: number;
requests: MembreProjet[];
onUpdate: () => void;
}

export function ProjectRequests({
projectId,
requests,
onUpdate,
}: ProjectRequestsProps) {
const { token } = useAuth();

const [
loadingId,
setLoadingId,
] = useState<number | null>(
null,
);

const [error, setError] =
useState("");

async function handleAccept(
memberId: number,
) {
if (!token) {
return;
}


try {
  setLoadingId(memberId);
  setError("");

  await projectsApi.acceptMember(
    projectId,
    memberId,
    token,
  );

  onUpdate();
} catch (error) {
  setError(
    error instanceof Error
      ? error.message
      : "Impossible d'accepter cette demande.",
  );
} finally {
  setLoadingId(null);
}


}

async function handleRefuse(
memberId: number,
) {
if (!token) {
return;
}


try {
  setLoadingId(memberId);
  setError("");

  await projectsApi.refuseMember(
    projectId,
    memberId,
    token,
  );

  onUpdate();
} catch (error) {
  setError(
    error instanceof Error
      ? error.message
      : "Impossible de refuser cette demande.",
  );
} finally {
  setLoadingId(null);
}


}

if (requests.length === 0) {
return ( <div className="rounded-lg border border-dashed py-12 text-center"> <UserRound className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />


    <h3 className="font-medium">
      Aucune demande en attente
    </h3>

    <p className="mt-1 text-sm text-muted-foreground">
      Les nouvelles demandes
      d&lsquo;intégration apparaîtront ici.
    </p>
  </div>
);


}

return ( <div className="space-y-4">
{error && ( <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
{error} </div>
)}


  {requests.map((request) => {
    const isLoading =
      loadingId === request.id;

    return (
      <div
        key={request.id}
        className="flex flex-col justify-between gap-5 rounded-lg border p-5 md:flex-row md:items-center"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <UserRound className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="font-semibold">
                {request.user?.prenom}{" "}
                {request.user?.nom}
              </p>

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />

                {request.user?.email}
              </div>
            </div>
          </div>

          <div className="text-sm">
            <span className="text-muted-foreground">
              Compétence demandée :
            </span>{" "}

            <span className="font-medium">
              {request.competence?.nom ??
                "Non précisée"}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              handleRefuse(request.id)
            }
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <X className="mr-2 h-4 w-4" />
            )}

            Refuser
          </Button>

          <Button
            onClick={() =>
              handleAccept(request.id)
            }
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}

            Accepter
          </Button>
        </div>
      </div>
    );
  })}
</div>


);
}
