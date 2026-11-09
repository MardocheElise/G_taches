/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

import {
  UserCompetence,
} from "@/types/user";

import {
  Competence,
} from "@/types/projet";
 
import {
  useAuth,
} from "@/components/providers/auth-provider";

import {
  Button,
} from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usersApi } from "@/lib/api/users";
import { competencesApi } from "@/lib/api/cpmpetence";

interface UserCompetencesProps {
  onUpdate?: () => void;
}

export function UserCompetences({
  onUpdate,
}: UserCompetencesProps) {
  const { token } = useAuth();

  const [
    userCompetences,
    setUserCompetences,
  ] = useState<UserCompetence[]>([]);

  const [
    allCompetences,
    setAllCompetences,
  ] = useState<Competence[]>([]);

  const [
    selectedCompetenceId,
    setSelectedCompetenceId,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [adding, setAdding] =
    useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState<number | null>(
    null,
  );

  const [error, setError] =
    useState("");

  async function loadData() {
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [
        myCompetences,
        competences,
      ] = await Promise.all([
        usersApi.getMyCompetences(token),
        competencesApi.getAll(token),
      ]);

      setUserCompetences(
        myCompetences,
      );

      setAllCompetences(
        competences,
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de charger les compétences.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [token]);

  const availableCompetences =
    allCompetences.filter(
      (competence) =>
        !userCompetences.some(
          (userCompetence) =>
            userCompetence.competenceId ===
            competence.id,
        ),
    );

  async function handleAdd() {
    if (!token || !selectedCompetenceId) {
      return;
    }

    try {
      setAdding(true);
      setError("");

      await usersApi.addMyCompetences(
        {
          competenceIds: [
            Number(
              selectedCompetenceId,
            ),
          ],
        },
        token,
      );

      setSelectedCompetenceId("");

      await loadData();

      onUpdate?.();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible d'ajouter la compétence.",
      );
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(
    competenceId: number,
  ) {
    if (!token) {
      return;
    }

    try {
      setDeletingId(
        competenceId,
      );

      setError("");

      await usersApi.removeMyCompetence(
        competenceId,
        token,
      );

      await loadData();

      onUpdate?.();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer la compétence.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AJOUT */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select
          value={selectedCompetenceId}
          onValueChange={
            setSelectedCompetenceId
          }
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Ajouter une compétence" />
          </SelectTrigger>

          <SelectContent>
            {availableCompetences.map(
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

        <Button
          onClick={handleAdd}
          disabled={
            !selectedCompetenceId ||
            adding
          }
        >
          {adding ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}

          Ajouter
        </Button>
      </div>

      {/* ERREUR */}
      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      {/* LISTE */}
      {userCompetences.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Vous n'avez encore ajouté aucune compétence.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {userCompetences.map(
            (userCompetence) => (
              <div
                key={userCompetence.id}
                className="flex items-center gap-2 rounded-full border bg-muted/30 px-4 py-2"
              >
                <span>
                  {
                    userCompetence
                      .competence
                      .nom
                  }
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={() =>
                    handleRemove(
                      userCompetence.competenceId,
                    )
                  }
                  disabled={
                    deletingId ===
                    userCompetence.competenceId
                  }
                >
                  {deletingId ===
                  userCompetence.competenceId ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </Button>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}