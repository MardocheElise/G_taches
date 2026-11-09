"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
Loader2,
Trash2,
} from "lucide-react";

import { projectsApi } from "@/lib/api/projects";

import { useAuth } from "@/components/providers/auth-provider";

import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
Button,
} from "@/components/ui/button";

interface DeleteProjectButtonProps {
projectId: number;
}

export function DeleteProjectButton({
projectId,
}: DeleteProjectButtonProps) {
const router = useRouter();

const { token } = useAuth();

const [loading, setLoading] =
useState(false);

const [error, setError] =
useState("");

async function handleDelete() {
if (!token) {
return;
}


try {
  setLoading(true);
  setError("");

  await projectsApi.remove(
    projectId,
    token,
  );

  router.push("/projects");
  router.refresh();
} catch (error) {
  setError(
    error instanceof Error
      ? error.message
      : "Impossible de supprimer le projet.",
  );

  setLoading(false);
}


}

return ( 
<AlertDialog> 
  <AlertDialogTrigger>
    Supprimer
  </AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Supprimer ce projet ?
      </AlertDialogTitle>

      <AlertDialogDescription>
        Cette action supprimera définitivement le projet
        et ses données associées.
      </AlertDialogDescription>
    </AlertDialogHeader>

    {error && (
      <p className="text-sm text-destructive">
        {error}
      </p>
    )}

    <AlertDialogFooter>
      <AlertDialogCancel>
        Annuler
      </AlertDialogCancel>

      <AlertDialogAction
        onClick={handleDelete}
        disabled={loading}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}

        Supprimer
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


);
}
