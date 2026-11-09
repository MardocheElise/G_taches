/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

import { Link2, Loader2, Plus, Trash2 } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";

import { tachesApi } from "@/lib/api/taches";

import { Tache, TacheDependance } from "@/types/tache";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
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

interface TaskDependenciesProps {
  projectId: number;

  task: Tache;

  tasks: Tache[];

  onSuccess: () => void;
}

export function TaskDependencies({
  projectId,
  task,
  tasks,
  onSuccess,
}: TaskDependenciesProps) {
  const { token } = useAuth();

  const [dependencies, setDependencies] = useState<TacheDependance[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState(false);

  const [selectedTaskId, setSelectedTaskId] = useState("");

  const [error, setError] = useState("");

  async function loadDependencies() {
    if (!token) return;

    try {
      setLoading(true);

      const data = await tachesApi.getDependances(projectId, task.id, token);

      setDependencies(data);
    } catch (error) {
      console.error("Erreur lors du chargement des dépendances", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDependencies();
  }, [task.id, token]);

  const availableTasks = tasks.filter((item) => {
    // Une tâche ne peut pas dépendre d'elle-même
    if (item.id === task.id) {
      return false;
    }

    // Ne pas afficher une dépendance déjà ajoutée
    const alreadyExists = dependencies.some(
      (dependency) => dependency.dependanceId === item.id,
    );

    return !alreadyExists;
  });

  async function handleAdd() {
    if (!token || !selectedTaskId) {
      return;
    }

    try {
      setSaving(true);

      setError("");

      await tachesApi.addDependance(
        projectId,
        task.id,
        { dependanceId: Number(selectedTaskId) }, // ← objet, pas nombre brut
        token,
      );

      setSelectedTaskId("");

      setOpen(false);

      await loadDependencies();

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible d'ajouter la dépendance.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(dependanceId: number) {
    if (!token) return;

    try {
      setSaving(true);

      await tachesApi.removeDependance(projectId, task.id, dependanceId, token);

      await loadDependencies();

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer la dépendance.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border-t pt-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-semibold">
            <Link2 className="h-4 w-4" />
            Dépendances
          </h3>

          <p className="text-sm text-muted-foreground">
            Cette tâche dépend des tâches ci-dessous.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            }
          ></DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une dépendance</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {error && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  La tâche "{task.titre}" dépend de :
                </p>

                <Select
                  value={selectedTaskId}
                  onValueChange={(value) => {
                    if (value !== null) {
                      setSelectedTaskId(value);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une tâche" />
                  </SelectTrigger>

                  <SelectContent>
                    {availableTasks.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.titre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={saving}
                >
                  Annuler
                </Button>

                <Button
                  onClick={handleAdd}
                  disabled={!selectedTaskId || saving}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ajouter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement des dépendances...
        </div>
      ) : dependencies.length === 0 ? (
        <p className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
          Cette tâche ne dépend d&apos;aucune autre tâche.
        </p>
      ) : (
        <div className="space-y-2">
          {dependencies.map((dependency) => (
            <div
              key={dependency.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-medium">{dependency.dependance.titre}</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {dependency.dependance.statut.replaceAll("_", " ")}
                </p>
              </div>

              <Button
                size="icon"
                variant="ghost"
                disabled={saving}
                onClick={() => handleRemove(dependency.dependanceId)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
