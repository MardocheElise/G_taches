/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";

import {
  CalendarDays,
  Edit,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { tachesApi } from "@/lib/api/taches";

import { CreateSubTaskDialog } from "./create-subtask-dialog";

import {
  PrioriteTache,
  StatutTache,
  Tache,
} from "@/types/tache";

import { MembreProjet } from "@/types/membre";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskDetailsDialogProps {
  task: Tache | null;

  projectId: number;

  members: MembreProjet[];

  tasks: Tache[];

  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  onSuccess: () => void;
}

export function TaskDetailsDialog({
  task,
  projectId,
  members,
  open,
  onOpenChange,
  onSuccess,
}: TaskDetailsDialogProps) {
  const { token } = useAuth();

  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [titre, setTitre] = useState("");

  const [description, setDescription] = useState("");

  const [priorite, setPriorite] =
    useState<PrioriteTache>("NORMALE");

  const [statut, setStatut] =
    useState<StatutTache>("A_FAIRE");

  const [dateEcheance, setDateEcheance] =
    useState("");

  const [assigneeId, setAssigneeId] =
    useState("");

  function initializeForm(currentTask: Tache) {
    setTitre(currentTask.titre);

    setDescription(
      currentTask.description ?? "",
    );

    setPriorite(currentTask.priorite);

    setStatut(currentTask.statut);

    setDateEcheance(
      currentTask.dateEcheance
        ? currentTask.dateEcheance
            .split("T")[0]
        : "",
    );

    setAssigneeId(
      currentTask.assigneeId
        ? String(currentTask.assigneeId)
        : "",
    );

    setError("");
  }

  function handleOpenChange(value: boolean) {
    onOpenChange(value);

    if (!value) {
      setEditing(false);
      setError("");
    }
  }

  async function handleUpdate() {
    if (!task || !token) return;

    if (!titre.trim()) {
      setError(
        "Le titre de la tâche est obligatoire.",
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      await tachesApi.update(
        projectId,
        task.id,
        {
          titre: titre.trim(),

          description:
            description.trim() || undefined,

          priorite,

          statut,

          dateEcheance:
            dateEcheance || undefined,

          assigneeId:
            assigneeId
              ? Number(assigneeId)
              : undefined,
        },
        token,
      );

      setEditing(false);

      onSuccess();

      onOpenChange(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de modifier la tâche.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!task || !token) return;

    const confirmed = window.confirm(
      `Supprimer la tâche "${task.titre}" ?`,
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await tachesApi.remove(
        projectId,
        task.id,
        token,
      );

      onSuccess();

      onOpenChange(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer la tâche.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!task) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {editing
              ? "Modifier la tâche"
              : task.titre}
          </DialogTitle>

          <DialogDescription>
            Consultez ou modifiez les informations
            de cette tâche.
          </DialogDescription>
        </DialogHeader>

        {!editing ? (
      <TaskDetails
        task={task}
        projectId={projectId}
        onEdit={() => {
          initializeForm(task);
          setEditing(true);
        }}
        onDelete={handleDelete}
        onSuccess={onSuccess}
        loading={loading}
      />
        ) : (
          <TaskForm
            titre={titre}
            description={description}
            priorite={priorite}
            statut={statut}
            dateEcheance={dateEcheance}
            assigneeId={assigneeId}
            members={members}
            loading={loading}
            error={error}
            onTitreChange={setTitre}
            onDescriptionChange={setDescription}
            onPrioriteChange={setPriorite}
            onStatutChange={setStatut}
            onDateEcheanceChange={setDateEcheance}
            onAssigneeChange={setAssigneeId}
            onCancel={() => {
              setEditing(false);
              setError("");
            }}
            onSubmit={handleUpdate}
          />
        )}
      </DialogContent>
    </Dialog>
  );  
}

interface TaskDetailsProps {
  task: Tache;
  projectId: number;
  onEdit: () => void;
  onDelete: () => void;
  onSuccess: () => void;
  loading: boolean;
}

function TaskDetails({
  task,
  onEdit,
  onDelete,
  loading,
}: TaskDetailsProps) {
  function formatDate(date: string | null) {
    if (!date) return "Non définie";

    return new Intl.DateTimeFormat(
      "fr-FR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      },
    ).format(new Date(date));
  }

  return (
    <div className="space-y-6">
      {task.description && (
        <div>
          <h3 className="mb-2 text-sm font-medium">
            Description
          </h3>

          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {task.description}
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">
            Statut
          </p>

          <p className="mt-1 font-medium">
            {task.statut.replaceAll("_", " ")}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Priorité
          </p>

          <p className="mt-1 font-medium">
            {task.priorite}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Responsable
          </p>

          <p className="mt-1 font-medium">
            {task.assignee
              ? `${task.assignee.prenom} ${task.assignee.nom}`
              : "Non assigné"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Échéance
          </p>

          <p className="mt-1 flex items-center gap-2 font-medium">
            <CalendarDays className="h-4 w-4" />

            {formatDate(task.dateEcheance)}
          </p>
        </div>
      </div>

      <div className="flex justify-between border-t pt-4">
        <Button
          variant="destructive"
          onClick={onDelete}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}

          Supprimer
        </Button>

        <Button onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />

          Modifier
        </Button>
      </div>
    </div>
  );
}


interface TaskFormProps {
  titre: string;
  description: string;
  priorite: PrioriteTache;
  statut: StatutTache;
  dateEcheance: string;
  assigneeId: string;
  members: MembreProjet[];
  loading: boolean;
  error: string;

  onTitreChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPrioriteChange: (value: PrioriteTache) => void;
  onStatutChange: (value: StatutTache) => void;
  onDateEcheanceChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;

  onCancel: () => void;
  onSubmit: () => void;
}

function TaskForm({
  titre,
  description,
  priorite,
  statut,
  dateEcheance,
  assigneeId,
  members,
  loading,
  error,
  onTitreChange,
  onDescriptionChange,
  onPrioriteChange,
  onStatutChange,
  onDateEcheanceChange,
  onAssigneeChange,
  onCancel,
  onSubmit,
}: TaskFormProps) {
  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label>Titre</Label>

        <Input
          value={titre}
          onChange={(event) =>
            onTitreChange(event.target.value)
          }
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>

        <Textarea
          value={description}
          onChange={(event) =>
            onDescriptionChange(event.target.value)
          }
          disabled={loading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Priorité</Label>

          <Select
            value={priorite}
            onValueChange={(value) =>
              onPrioriteChange(
                value as PrioriteTache,
              )
            }
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
          <Label>Statut</Label>

          <Select
            value={statut}
            onValueChange={(value) =>
              onStatutChange(
                value as StatutTache,
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="A_FAIRE">
                À faire
              </SelectItem>

              <SelectItem value="EN_COURS">
                En cours
              </SelectItem>

              <SelectItem value="TERMINE">
                Terminé
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Responsable</Label>

          <Select
            value={assigneeId}
            onValueChange={onAssigneeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Non assigné" />
            </SelectTrigger>

            <SelectContent>
              {members.map((member) => (
                <SelectItem
                  key={member.id}
                  value={String(member.user?.id)}
                >
                  {member.user?.prenom}{" "}
                  {member.user?.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Échéance</Label>

          <Input
            type="date"
            value={dateEcheance}
            onChange={(event) =>
              onDateEcheanceChange(
                event.target.value,
              )
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </Button>

        <Button
          onClick={onSubmit}
          disabled={loading}
        >
          {loading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}

          <Save className="mr-2 h-4 w-4" />

          Enregistrer
        </Button>
      </div>
    </div>
  );
}
