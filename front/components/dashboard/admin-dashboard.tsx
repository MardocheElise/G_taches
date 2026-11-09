"use client";

import {
useEffect,
useState,
} from "react";

import {
FolderKanban,
Clock3,
CheckCircle2,
Archive,
Users,
CalendarDays,
} from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";

import { dashboardApi } from "@/lib/api/dashboard";

import { DashboardData } from "@/types/dashboard";

import { StatsCard } from "./stats-card";

import {
ProjectsStatusChart,
} from "./projects-status-chart";

import {
RecentProjects,
} from "./recent-projects";

export function AdminDashboard() {
const { user, token } = useAuth();

const [
dashboard,
setDashboard,
] = useState<DashboardData | null>(
null,
);

const [loading, setLoading] =
useState(true);

const [error, setError] =
useState("");

useEffect(() => {
async function loadDashboard() {
if (!token) {
return;
}

  try {
    setLoading(true);

    const data =
      await dashboardApi.getDashboard(
        token,
      );

    setDashboard(data);
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Impossible de charger le dashboard.",
    );
  } finally {
    setLoading(false);
  }
}

loadDashboard();

}, [token]);

if (loading) {
return ( <div className="flex min-h-[60vh] items-center justify-center">
Chargement du dashboard... </div>
);
}

if (error) {
return ( <div className="rounded-lg border p-6"> <p className="font-medium">
Une erreur est survenue </p>

    <p className="mt-2 text-sm text-muted-foreground">
      {error}
    </p>
  </div>
);

}

if (!dashboard) {
return null;
}

const { statistiques } = dashboard;

return ( <div className="space-y-6"> <div> <h1 className="text-2xl font-bold">
Bonjour {user?.prenom} </h1>

    <p className="mt-1 text-muted-foreground">
      Voici un aperçu global de la plateforme.
    </p>
  </div>

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <StatsCard
      title="Total des projets"
      value={statistiques.totalProjets}
      icon={
        <FolderKanban className="h-7 w-7" />
      }
    />

    <StatsCard
      title="Projets planifiés"
      value={statistiques.projetsPlanifies}
      icon={
        <CalendarDays className="h-7 w-7" />
      }
    />

    <StatsCard
      title="Projets en cours"
      value={statistiques.projetsEnCours}
      icon={
        <Clock3 className="h-7 w-7" />
      }
    />

    <StatsCard
      title="Projets terminés"
      value={statistiques.projetsTermines}
      icon={
        <CheckCircle2 className="h-7 w-7" />
      }
    />

    <StatsCard
      title="Projets archivés"
      value={statistiques.projetsArchives}
      icon={
        <Archive className="h-7 w-7" />
      }
    />

    <StatsCard
      title="Utilisateurs"
      value={statistiques.totalUtilisateurs}
      icon={
        <Users className="h-7 w-7" />
      }
    />
  </div>

  <div className="grid gap-6 xl:grid-cols-2">
    <ProjectsStatusChart
      data={dashboard.projetsParStatut}
    />

    <RecentProjects
      projects={dashboard.derniersProjets}
    />
  </div>
</div>

);
}
