/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock3,
  Loader2,
  Play,
  RotateCcw,
} from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";

import { projectsApi } from "@/lib/api/projects";
import { tachesApi } from "@/lib/api/taches";

import { ProjetDetail } from "@/types/projet";

import { TaskDetailsDialog } from "@/components/taches/task-details-dialog";

import { StatutTache, Tache } from "@/types/tache";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MembreProjet } from "@/types/membre";

import { CreateTaskDialog } from "@/components/taches/create-task-dialog";

export default function TasksPage() {
  const params = useParams();

  const { token } = useAuth();

  const id = Number(params.id);

  const [project, setProject] = useState<ProjetDetail | null>(null);

  const [tasks, setTasks] = useState<Tache[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [members, setMembers] = useState<MembreProjet[]>([]);

  const [selectedTask, setSelectedTask] = useState<Tache | null>(null);

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!token || !id) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [projectData, tasksData, membersData] = await Promise.all([
        projectsApi.getById(id, token),

        tachesApi.getAll(id, token),

        projectsApi.getMembers(id, token),
      ]);

      setProject(projectData);

      setTasks(tasksData);

      setMembers(membersData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de charger les tâches.",
      );
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function getTasksByStatus(statut: StatutTache) {
    return tasks.filter(
      (task) => task.statut === statut && task.parentId === null,
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Chargement des tâches...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link href={`/projects/${id}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au projet
          </Button>
        </Link>

        <div className="rounded-lg border p-6">
          <h2 className="font-semibold">Impossible de charger les tâches</h2>

          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const aFaire = getTasksByStatus("A_FAIRE");

  const enCours = getTasksByStatus("EN_COURS");

  const terminees = getTasksByStatus("TERMINEE");

  const handleTaskClick = async (task: Tache) => {
    if (!token) {
      return;
    }

    try {
      const taskData = await tachesApi.getById(id, task.id, token);

      setSelectedTask(taskData);

      setTaskDialogOpen(true);
    } catch (error) {
      console.error("Impossible de charger la tâche", error);
    }
  };

  const handleStatusChange = async (task: Tache, statut: StatutTache) => {
    if (!token) {
      return;
    }

    try {
      await tachesApi.changeStatut(
        id,
        task.id,
        {
          statut: statut,
        },
        token,
      );

      await loadData();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Impossible de modifier le statut de la tâche.";

      alert(message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/projects/${id}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au projet
          </Button>
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Tâches du projet</h1>

            <p className="mt-1 text-muted-foreground">{project?.nom}</p>
          </div>

          <CreateTaskDialog
            projectId={id}
            members={members}
            onSuccess={loadData}
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <TaskColumn
          title="À faire"
          tasks={aFaire}
          icon={<Circle className="h-5 w-5" />}
          onTaskClick={handleTaskClick}
          onStatusChange={handleStatusChange}
        />

        <TaskColumn
          title="En cours"
          tasks={enCours}
          icon={<Clock3 className="h-5 w-5" />}
          onTaskClick={handleTaskClick}
          onStatusChange={handleStatusChange}
        />

        <TaskColumn
          title="Terminées"
          tasks={terminees}
          icon={<CheckCircle2 className="h-5 w-5" />}
          onTaskClick={handleTaskClick}
          onStatusChange={handleStatusChange}
        />
      </div>
      <TaskDetailsDialog
        task={selectedTask}
        projectId={id}
        members={members}
        tasks={tasks}
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSuccess={loadData}
      />
    </div>
  );
}

interface TaskColumnProps {
  title: string;
  tasks: Tache[];
  icon: React.ReactNode;

  onTaskClick: (task: Tache) => void;

  onStatusChange?: (task: Tache, statut: StatutTache) => Promise<void>;
}
// function TaskColumn({
//   title,
//   tasks,
//   icon,
//   onTaskClick,
//   onStatusChange,
// }: TaskColumnProps) {
//   return (
//     <Card className="h-fit">
//       <CardHeader>
//         <CardTitle className="flex items-center justify-between text-base">
//           <span className="flex items-center gap-2">
//             {icon}

//             {title}
//           </span>

//           <span className="text-sm font-normal text-muted-foreground">
//             {tasks.length}
//           </span>
//         </CardTitle>
//       </CardHeader>

//       <CardContent>
//         {tasks.length === 0 ? (
//           <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
//             Aucune tâche
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {tasks.map((task) => (
//               <TaskCard
//                 key={task.id}
//                 task={task}
//                 onClick={() => onTaskClick(task)}
//                 onStatusChange={onStatusChange}
//               />
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

function TaskColumn({
  title,
  tasks,
  icon,
  onTaskClick,
  onStatusChange,
}: TaskColumnProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            {icon}
            {title}
          </span>

          <span className="text-sm font-normal text-muted-foreground">
            {tasks.length}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
            Aucune tâche
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface TaskCardProps {
  task: Tache;
  onClick: () => void;
  onStatusChange?: (task: Tache, statut: StatutTache) => Promise<void>;
}

function TaskCard({ task, onClick, onStatusChange }: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-3">
        {/* Informations de la tâche */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium">{task.titre}</h3>

            <TaskPriorityBadge priorite={task.priorite} />
          </div>

          <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
            {task.assignee && (
              <span>
                {task.assignee.prenom} {task.assignee.nom}
              </span>
            )}

            {task.dateEcheance && (
              <span>
                Échéance :{" "}
                {new Intl.DateTimeFormat("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(new Date(task.dateEcheance))}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex shrink-0 items-center gap-1"
          onClick={(event) => event.stopPropagation()}
        >
          {task.statut === "A_FAIRE" && (
            <>
              {/* Passer en cours */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="Passer en cours"
                onClick={() => onStatusChange?.(task, "EN_COURS")}
              >
                <Play className="h-4 w-4" />
              </Button>

              {/* Terminer directement */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="Terminer la tâche"
                onClick={() => onStatusChange?.(task, "TERMINEE")}
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </>
          )}

          {task.statut === "EN_COURS" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Terminer la tâche"
              onClick={() => onStatusChange?.(task, "TERMINEE")}
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}

          {task.statut === "TERMINEE" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Remettre en cours"
              onClick={() => onStatusChange?.(task, "EN_COURS")}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskPriorityBadge({ priorite }: { priorite: Tache["priorite"] }) {
  const labels = {
    BASSE: "Basse",
    NORMALE: "Normale",
    HAUTE: "Haute",
    URGENTE: "Urgente",
  };

  return (
    <span className="rounded-full border px-2 py-1 text-xs">
      {labels[priorite]}
    </span>
  );
}
