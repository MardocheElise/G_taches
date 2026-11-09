"use client";

import { useState } from "react";

import {
  Loader2,
  Plus,
} from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";

import { tachesApi } from "@/lib/api/taches";

import { Tache } from "@/types/tache";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

interface CreateSubTaskDialogProps {
  projectId: number;
  parentTask: Tache;
  onSuccess: () => void;
}

export function CreateSubTaskDialog({
  projectId,
  parentTask,
  onSuccess,
}: CreateSubTaskDialogProps) {
  const { token } = useAuth();

  const [open, setOpen] =
    useState(false);

  const [titre, setTitre] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token) {
      return;
    }

    if (!titre.trim()) {
      setError(
        "Le titre de la sous-tâche est obligatoire.",
      );

      return;
    }

    try {
      setLoading(true);

      setError("");

      await tachesApi.create(
        projectId,
        {
          titre: titre.trim(),

          description:
            description.trim() || undefined,

          parentId: parentTask.id,
        },
        token,
      );

      setTitre("");

      setDescription("");

      setOpen(false);

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de créer la sous-tâche.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />

          Sous-tâche
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Ajouter une sous-tâche
          </DialogTitle>

          <DialogDescription>
            Cette sous-tâche sera rattachée à :
            {" "}
            {parentTask.titre}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="subtask-title">
              Titre *
            </Label>

            <Input
              id="subtask-title"
              value={titre}
              onChange={(event) =>
                setTitre(event.target.value)
              }
              disabled={loading}
              placeholder="Ex. Créer le composant"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtask-description">
              Description
            </Label>

            <Textarea
              id="subtask-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              disabled={loading}
              placeholder="Description optionnelle..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              Créer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}