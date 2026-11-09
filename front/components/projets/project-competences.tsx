"use client";

import { useState } from "react";

import { Loader2, Pencil, Trash2 } from "lucide-react";

import { ProjetCompetence } from "@/types/projet";

import { useAuth } from "@/components/providers/auth-provider";

import { projectsApi } from "@/lib/api/projects";

import { AddProjectCompetenceForm } from "./add-project-competence-form";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

interface ProjectCompetencesProps {
  projectId: number;

  competences: ProjetCompetence[];

  onSuccess: () => void;
}

export function ProjectCompetences({
  projectId,
  competences,
  onSuccess,
}: ProjectCompetencesProps) {
  const { token } = useAuth();

  const [editingId, setEditingId] = useState<number | null>(null);

  const [nombreMembres, setNombreMembres] = useState(1);

  const [loadingId, setLoadingId] = useState<number | null>(null);

  const [error, setError] = useState("");

  function startEdit(projetCompetence: ProjetCompetence) {
    setEditingId(projetCompetence.competenceId);

    setNombreMembres(projetCompetence.nombreMax);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleUpdate(competenceId: number) {
    if (!token) {
      return;
    }

    try {
      setLoadingId(competenceId);
      setError("");

      await projectsApi.updateCompetence(
        projectId,
        competenceId,
        {
          nombreMax: Number(nombreMembres),
        },
        token,
      );

      setEditingId(null);

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de modifier la compétence.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(competenceId: number) {
    if (!token) {
      return;
    }

    try {
      setLoadingId(competenceId);
      setError("");

      await projectsApi.removeCompetence(projectId, competenceId, token);

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer la compétence.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {" "}
      <AddProjectCompetenceForm projectId={projectId} onSuccess={onSuccess} />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!competences || competences.length === 0 ? (
        <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
          Aucune compétence requise pour ce projet.
        </p>
      ) : (
        <div className="space-y-3">
          {competences.map((projetCompetence) => {
            const isEditing = editingId === projetCompetence.competenceId;

            const isLoading = loadingId === projetCompetence.competenceId;

            return (
              <div
                key={projetCompetence.id}
                className="flex flex-col justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-center"
              >
                <div>
                  <p className="font-medium">
                    {projetCompetence.competence.nom}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Membres requis : {projetCompetence.nombreMax}
                  </p>
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      value={nombreMembres}
                      onChange={(event) =>
                        setNombreMembres(Number(event.target.value))
                      }
                      className="w-24"
                    />

                    <Button
                      size="sm"
                      onClick={() =>
                        handleUpdate(projetCompetence.competenceId)
                      }
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}

                      {!isLoading && "Enregistrer"}
                    </Button>

                    <Button variant="outline" size="sm" onClick={cancelEdit}>
                      Annuler
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => startEdit(projetCompetence)}
                      disabled={isLoading}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() =>
                        handleDelete(projetCompetence.competenceId)
                      }
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
