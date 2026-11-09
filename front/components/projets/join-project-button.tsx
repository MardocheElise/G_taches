"use client";

import { useEffect, useMemo, useState } from "react";

import { Loader2, UserPlus } from "lucide-react";

import { ProjetCompetence } from "@/types/projet";

import { UserCompetence } from "@/types/user";

import { projectsApi } from "@/lib/api/projects";

import { usersApi } from "@/lib/api/users";

import { useAuth } from "@/components/providers/auth-provider";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JoinProjectButtonProps {
  projectId: number;
  competences: ProjetCompetence[];
  onSuccess?: () => void;
}

export function JoinProjectButton({
  projectId,
  competences,
  onSuccess,
}: JoinProjectButtonProps) {
  const { token } = useAuth();

  const [open, setOpen] = useState(false);

  const [userCompetences, setUserCompetences] = useState<UserCompetence[]>([]);

  const [loadingCompetences, setLoadingCompetences] = useState(false);

  const [competenceId, setCompetenceId] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // Chargement des compétences de l'utilisateur
  useEffect(() => {
    async function loadMyCompetences() {
      if (!token) {
        return;
      }

      try {
        setLoadingCompetences(true);

        const data = await usersApi.getMyCompetences(token);

        setUserCompetences(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Impossible de charger vos compétences.",
        );
      } finally {
        setLoadingCompetences(false);
      }
    }

    loadMyCompetences();
  }, [token]);

  // Intersection :
  // compétences utilisateur ∩ compétences du projet
  const compatibleCompetences = useMemo(() => {
    return (competences ?? []).filter((projectCompetence) =>
      (userCompetences ?? []).some(
        (userCompetence) =>
          userCompetence.competenceId === projectCompetence.competenceId,
      ),
    );
  }, [competences, userCompetences]);

  async function handleJoin() {
    if (!token || !competenceId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await projectsApi.join(
        projectId,
        {
          competenceId: Number(competenceId),
        },
        token,
      );

      setOpen(false);
      setCompetenceId("");

      onSuccess?.();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible d'envoyer la demande.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={loadingCompetences}>
          {loadingCompetences ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          Rejoindre le projet
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejoindre le projet</DialogTitle>

          <DialogDescription>
            Choisissez la compétence avec laquelle vous souhaitez intégrer ce
            projet.
          </DialogDescription>
        </DialogHeader>

        {compatibleCompetences.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="font-medium">Aucune compétence compatible</p>

            <p className="mt-2 text-sm text-muted-foreground">
              Vous devez posséder au moins une compétence recherchée par ce
              projet.
            </p>
          </div>
        ) : (
          <div className="space-y-2 py-4">
            <Label>Ma compétence</Label>

            <Select value={competenceId} onValueChange={setCompetenceId}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une compétence" />
              </SelectTrigger>

              <SelectContent>
                {compatibleCompetences.map((item) => (
                  <SelectItem key={item.id} value={String(item.competenceId)}>
                    {item.competence.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Annuler
          </Button>

          {compatibleCompetences.length > 0 && (
            <Button onClick={handleJoin} disabled={!competenceId || loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Envoyer ma demande
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
