"use client";

import {
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
  tachesApi,
} from "@/lib/api/taches";

import {
  PrioriteTache,
} from "@/types/tache";

import {
  MembreProjet,
} from "@/types/membre";

import {
  Button,
} from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Textarea,
} from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateTaskDialogProps {
  projectId: number;

  members: MembreProjet[];

  onSuccess: () => void;
}

export function CreateTaskDialog({
  projectId,
  members,
  onSuccess,
}: CreateTaskDialogProps) {
  const { token } = useAuth();

  const [open, setOpen] =
    useState(false);

  const [titre, setTitre] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [priorite, setPriorite] =
    useState<PrioriteTache>(
      "NORMALE",
    );

  const [dateDebut, setDateDebut] =
    useState("");

  const [
    dateEcheance,
    setDateEcheance,
  ] = useState("");

  const [
    assigneeId,
    setAssigneeId,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function resetForm() {
    setTitre("");
    setDescription("");
    setPriorite("NORMALE");
    setDateDebut("");
    setDateEcheance("");
    setAssigneeId("");
    setError("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token) {
      return;
    }

    if (!titre.trim()) {
      setError(
        "Le titre de la tâche est obligatoire.",
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

          priorite,

          dateDebut:
            dateDebut || undefined,

          dateEcheance:
            dateEcheance || undefined,

          assigneeId:
            assigneeId
              ? Number(assigneeId)
              : undefined,
        },
        token,
      );

      resetForm();

      setOpen(false);

      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de créer la tâche.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />

          Nouvelle tâche
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Créer une tâche
          </DialogTitle>

          <DialogDescription>
            Ajoutez une nouvelle tâche au projet.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="titre">
              Titre *
            </Label>

            <Input
              id="titre"
              value={titre}
              onChange={(event) =>
                setTitre(event.target.value)
              }
              placeholder="Ex. Concevoir la page d'accueil"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description
            </Label>

            <Textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Décrivez la tâche..."
              disabled={loading}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Priorité
              </Label>

              <Select
                value={priorite}
                onValueChange={(
                  value,
                ) =>
                  setPriorite(
                    value as PrioriteTache,
                  )
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="BASSE">
                    Basse
                  </SelectItem>

                  <SelectItem value="NORMALE">
                    Normale
                  </SelectItem>

                  <SelectItem value="HAUTE">
                    Haute
                  </SelectItem>

                  <SelectItem value="URGENTE">
                    Urgente
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Responsable
              </Label>

              <Select
                value={assigneeId}
                onValueChange={
                  setAssigneeId
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Non assignée" />
                </SelectTrigger>

                <SelectContent>
                  {members.map((member) => (
                    <SelectItem
                      key={member.id}
                      value={String(
                        member.user?.id,
                      )}
                    >
                      {member.user?.prenom}{" "}
                      {member.user?.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dateDebut">
                Date de début
              </Label>

              <Input
                id="dateDebut"
                type="date"
                value={dateDebut}
                onChange={(event) =>
                  setDateDebut(
                    event.target.value,
                  )
                }
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateEcheance">
                Date d&apos;échéance
              </Label>

              <Input
                id="dateEcheance"
                type="date"
                value={dateEcheance}
                onChange={(event) =>
                  setDateEcheance(
                    event.target.value,
                  )
                }
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setOpen(false)
              }
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

              Créer la tâche
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}