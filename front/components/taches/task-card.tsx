
"use client";

import { useState } from "react";

import {
  CheckCircle2,
  ChevronRight,
  Loader2,
} from "lucide-react";

import {
  StatutTache,
  Tache,
} from "@/types/tache";

import { Button } from "@/components/ui/button";

interface TaskCardProps {
  task: Tache;

  onClick: () => void;

  onStatusChange: (
    task: Tache,
    statut: StatutTache,
  ) => Promise<void>;
}

export function TaskCard({
  task,
  onClick,
  onStatusChange,
}: TaskCardProps) {
  const [loading, setLoading] =
    useState(false);

  async function handleStatusChange(
    event: React.MouseEvent,
    statut: StatutTache,
  ) {
    event.stopPropagation();

    try {
      setLoading(true);

      await onStatusChange(
        task,
        statut,
      );
    } finally {
      setLoading(false);
    }
  }

  const isAFaire =
    task.statut === "A_FAIRE";

  const isEnCours =
    task.statut === "EN_COURS";

  const isTerminee =
    task.statut === "TERMINEE";

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border bg-card p-4 transition hover:shadow-sm"
    >
      <div className="mb-3">
        <h3 className="font-medium">
          {task.titre}
        </h3>

        {task.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {task.priorite}
        </span>

        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <div className="flex items-center gap-1">
            {isAFaire && (
              <Button
                size="icon"
                variant="ghost"
                title="Passer en cours"
                onClick={(event) =>
                  handleStatusChange(
                    event,
                    "EN_COURS",
                  )
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}

            {isEnCours && (
              <Button
                size="icon"
                variant="ghost"
                title="Marquer comme terminée"
                onClick={(event) =>
                  handleStatusChange(
                    event,
                    "TERMINEE",
                  )
                }
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}

            {isTerminee && (
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}