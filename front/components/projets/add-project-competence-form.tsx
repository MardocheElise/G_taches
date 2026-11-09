"use client";

import {
useEffect,
useState,
} from "react";

import {
Loader2,
Plus,
} from "lucide-react";

import {
useAuth,
} from "@/components/providers/auth-provider";


import {
projectsApi,
} from "@/lib/api/projects";

import {
Competence,
} from "@/types/projet";

import {
Button,
} from "@/components/ui/button";

import {
Input,
} from "@/components/ui/input";

import {
Label,
} from "@/components/ui/label";

import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";
import { competencesApi } from "@/lib/api/cpmpetence";

interface AddProjectCompetenceFormProps {
projectId: number;

onSuccess: () => void;
}

export function AddProjectCompetenceForm({
projectId,
onSuccess,
}: AddProjectCompetenceFormProps) {
const { token } = useAuth();

const [competences, setCompetences] =
useState<Competence[]>([]);

const [competenceId, setCompetenceId] =
useState("");

const [
nombreMembres,
setNombreMembres,
] = useState(1);

const [loading, setLoading] =
useState(false);

const [loadingCompetences, setLoadingCompetences] =
useState(true);

const [error, setError] =
useState("");

useEffect(() => {
async function loadCompetences() {
if (!token) {
return;
}


  try {
    setLoadingCompetences(true);

    const data =
      await competencesApi.getAll(token);

    setCompetences(data);
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Impossible de charger les compétences.",
    );
  } finally {
    setLoadingCompetences(false);
  }
}

loadCompetences();


}, [token]);

async function handleSubmit(
event: React.FormEvent,
) {
event.preventDefault();


if (!token || !competenceId) {
  return;
}

try {
  setLoading(true);
  setError("");

  await projectsApi.addCompetence(
    projectId,
    {
      competenceId:
        Number(competenceId),

      nombreMax:
        Number(nombreMembres),
    },
    token,
  );

  setCompetenceId("");
  setNombreMembres(1);

  onSuccess();
} catch (error) {
  setError(
    error instanceof Error
      ? error.message
      : "Impossible d'ajouter la compétence.",
  );
} finally {
  setLoading(false);
}


}

return ( <form
   onSubmit={handleSubmit}
   className="space-y-4"
 > <div className="grid gap-4 md:grid-cols-[1fr_160px_auto]"> <div className="space-y-2"> <Label>
Compétence </Label>


      <Select
        value={competenceId}
        onValueChange={
          setCompetenceId
        }
        disabled={
          loadingCompetences ||
          loading
        }
      >
        <SelectTrigger>
          <SelectValue
            placeholder={
              loadingCompetences
                ? "Chargement..."
                : "Sélectionner une compétence"
            }
          />
        </SelectTrigger>

        <SelectContent>
          {competences.map(
            (competence) => (
              <SelectItem
                key={competence.id}
                value={String(
                  competence.id,
                )}
              >
                {competence.nom}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label>
        Nombre requis
      </Label>

      <Input
        type="number"
        min={1}
        value={nombreMembres}
        onChange={(event) =>
          setNombreMembres(
            Number(
              event.target.value,
            ),
          )
        }
        disabled={loading}
      />
    </div>

    <div className="flex items-end">
      <Button
        type="submit"
        disabled={
          loading ||
          !competenceId
        }
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Plus className="mr-2 h-4 w-4" />
        )}

        Ajouter
      </Button>
    </div>
  </div>

  {error && (
    <p className="text-sm text-destructive">
      {error}
    </p>
  )}
</form>


);
}
