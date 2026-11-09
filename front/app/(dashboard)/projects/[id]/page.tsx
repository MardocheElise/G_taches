/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/set-state-in-effect */
// "use client";

// import { useCallback, useEffect, useState } from "react";

// import Link from "next/link";
// import { useParams } from "next/navigation";

// import { ArrowLeft, CalendarDays, CheckSquare, ClipboardList, Users } from "lucide-react";

// import { useAuth } from "@/components/providers/auth-provider";
// import { projectsApi } from "@/lib/api/projects";

// import { ProjetDetail } from "@/types/projet";

// import { Button } from "@/components/ui/button";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// import { StatutBadge } from "@/components/projets/statut-badge";

// import { Pencil } from "lucide-react";

// import { DeleteProjectButton } from "@/components/projets/delete-project-button";
// import { ProjectCompetences } from "@/components/projets/project-competences";
// import { JoinProjectButton } from "@/components/projets/join-project-button";
// import { MembreProjet } from "@/types/membre";
// import {
//   ProjectMembers,
// } from "@/components/projets/project-members";

// export default function ProjectDetailPage() {
//   const params = useParams();

//   const { token, user } = useAuth();

//   const [project, setProject] = useState<ProjetDetail | null>(null);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState("");

//   const [members, setMembers] =
//   useState<MembreProjet[]>([]);

//   const [loadingMembers, setLoadingMembers] =
//   useState(false);

//   const id = Number(params.id);

//   async function loadProject() {
//     if (!token || !id) {
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const data = await projectsApi.getById(id, token);

//       setProject(data);
//     } catch (error) {
//       setError(
//         error instanceof Error
//           ? error.message
//           : "Impossible de charger le projet.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   const loadMembers = useCallback(
//   async () => {
//     if (!token || !projectId) return;

//     try {
//       setLoadingMembers(true);

//       const data =
//         await projectsApi.getMembers(
//           projectId,
//           token,
//         );

//       setMembers(data);
//     } catch (error) {
//       console.error(
//         "Erreur chargement membres",
//         error,
//       );
//     } finally {
//       setLoadingMembers(false);
//     }
//   },
//   [projectId, token],
// );

//   useEffect(() => {
//     loadProject();
//      loadMembers();
//   }, [loadProject, loadMembers]);

//   function formatDate(date: string) {
//     return new Intl.DateTimeFormat("fr-FR", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     }).format(new Date(date));
//   }

//   if (loading) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center">
//         Chargement du projet...{" "}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="space-y-4">
//         {" "}
//         <Link href="/projects">
//           {" "}
//           <Button variant="outline">
//             {" "}
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Retour aux projets{" "}
//           </Button>{" "}
//         </Link>
//         <div className="rounded-lg border p-6">
//           <h2 className="font-semibold">Impossible de charger le projet</h2>

//           <p className="mt-2 text-sm text-muted-foreground">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!project) {
//     return null;
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <Link href="/projects">
//           <Button variant="ghost" size="sm" className="mb-4">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Retour aux projets
//           </Button>
//         </Link>

//         <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
//           <div>
//             <div className="flex flex-wrap items-center gap-3">
//               <h1 className="text-3xl font-bold">{project.nom}</h1>

//               <StatutBadge statut={project.statut} />
//             </div>

//             {project.description && (
//               <p className="mt-3 max-w-3xl text-muted-foreground">
//                 {project.description}
//               </p>
//             )}
//           </div>

//             {user?.role === "SUPER_ADMIN" && (
//               <div className="flex flex-wrap gap-2">
//                 <Button
//                   asChild
//                   variant="outline"
//                   size="sm"
//                 >
//                   <Link
//                     href={`/projects/${project.id}/requests`}
//                   >
//                     <ClipboardList className="mr-2 h-4 w-4" />

//                     Demandes
//                   </Link>
//                 </Button>

//                 <Button
//                   asChild
//                   variant="outline"
//                   size="sm"
//                 >
//                   <Link
//                     href={`/projects/${project.id}/edit`}
//                   >
//                     <Pencil className="mr-2 h-4 w-4" />

//                     Modifier
//                   </Link>
//                 </Button>

//                 <DeleteProjectButton
//                   projectId={project.id}
//                 />
//               </div>
//             )}

//             {user?.role !== "SUPER_ADMIN" && (
//               <JoinProjectButton
//                 projectId={project.id}
//                 competences={project.competences}
//                 onSuccess={loadProject}
//               />
//             )}
//         </div>
//       </div>

//         <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
//         <Card>
//           <CardContent className="flex items-center gap-4 p-6">
//             <CalendarDays className="h-7 w-7 text-muted-foreground" />

//             <div>
//               <p className="text-sm text-muted-foreground">Date de début</p>

//               <p className="font-medium">{formatDate(project.dateDebut)}</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="flex items-center gap-4 p-6">
//             <CalendarDays className="h-7 w-7 text-muted-foreground" />

//             <div>
//               <p className="text-sm text-muted-foreground">Date de fin</p>

//               <p className="font-medium">
//                 {project.dateFin ? formatDate(project.dateFin) : "Non définie"}
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="flex items-center gap-4 p-6">
//             <Users className="h-7 w-7 text-muted-foreground" />

//             <div>
//               <p className="text-sm text-muted-foreground">Membres</p>

//               <p className="font-medium">
//                 {project._count.membres} / {project.nombreMembresMax}
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="flex items-center gap-4 p-6">
//             <CheckSquare className="h-7 w-7 text-muted-foreground" />

//             <div>
//               <p className="text-sm text-muted-foreground">Tâches</p>

//               <p className="font-medium">{project._count.taches}</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Compétences requises</CardTitle>
//           </CardHeader>

//           <CardContent>
//             {user?.role === "SUPER_ADMIN" ? (
//               <ProjectCompetences
//                 projectId={project.id}
//                 competences={project.competences}
//                 onSuccess={loadProject}
//               />
//             ) : (
//               <div className="space-y-3">
//                 {project.competences.length === 0 ? (
//                   <p className="py-4 text-sm text-muted-foreground">
//                     Aucune compétence spécifique n&apos;est actuellement requise.
//                   </p>
//                 ) : (
//                   project.competences.map((item) => (
//                     <div
//                       key={item.id}
//                       className="flex items-center justify-between rounded-lg border p-4"
//                     >
//                       <span className="font-medium">{item.competence.nom}</span>

//                       <span className="text-sm text-muted-foreground">
//                         {item.nombreMax} membre(s) recherché(s)
//                       </span>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Membres du projet</CardTitle>
//           </CardHeader>

//           <CardContent>
//             {project.membres.length === 0 ? (
//               <p className="py-8 text-center text-sm text-muted-foreground">
//                 Aucun membre dans ce projet.
//               </p>
//             ) : (
//               <div className="space-y-3">
//                 {project.membres.map((membre) => (
//                   <div
//                     key={membre.id}
//                     className="flex items-center justify-between rounded-lg border p-4"
//                   >
//                     <div>
//                       <p className="font-medium">
//                         {membre.user?.prenom} {membre.user?.nom}
//                       </p>

//                       <p className="text-sm text-muted-foreground">
//                         {membre.user?.email}
//                       </p>
//                     </div>

//                     <div className="text-right">
//                       <p className="text-sm font-medium">
//                         {membre.role === "CHEF_PROJET"
//                           ? "Chef de projet"
//                           : "Membre"}
//                       </p>

//                       <p className="text-xs text-muted-foreground">
//                         {membre.statut}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//     </div>
//   );
// }

/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  Loader2,
  Pencil,
  Users,
} from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";

import { projectsApi } from "@/lib/api/projects";

import { ProjetDetail } from "@/types/projet";
import { MembreProjet } from "@/types/membre";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { StatutBadge } from "@/components/projets/statut-badge";

import { DeleteProjectButton } from "@/components/projets/delete-project-button";

import { ProjectCompetences } from "@/components/projets/project-competences";

import { JoinProjectButton } from "@/components/projets/join-project-button";

import { ProjectMembers } from "@/components/projets/project-members";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProjectDetailPage() {
  const params = useParams();

  const { token, user } = useAuth();

  const id = Number(params.id);

  const [project, setProject] = useState<ProjetDetail | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [members, setMembers] = useState<MembreProjet[]>([]);

  const [loadingMembers, setLoadingMembers] = useState(false);

  const loadProject = useCallback(async () => {
    if (!token || !id) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await projectsApi.getById(id, token);

      setProject(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de charger le projet.",
      );
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  const loadMembers = useCallback(async () => {
    if (!token || !id) {
      return;
    }

    try {
      setLoadingMembers(true);

      const data = await projectsApi.getMembers(id, token);

      setMembers(data);
    } catch (error) {
      console.error("Erreur chargement membres", error);
    } finally {
      setLoadingMembers(false);
    }
  }, [id, token]);

  useEffect(() => {
    loadProject();
    loadMembers();
  }, [loadProject, loadMembers]);

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        {" "}
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Chargement du projet...{" "}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        {" "}
        <Link href="/projects">
          {" "}
          <Button variant="outline">
            {" "}
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux projets{" "}
          </Button>{" "}
        </Link>
        <div className="rounded-lg border p-6">
          <h2 className="font-semibold">Impossible de charger le projet</h2>

          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-6">
      {" "}
      <div>
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux projets
          </Button>
        </Link>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold">{project.nom}</h1>

              <StatutBadge statut={project.statut} />
            </div>

            {project.description && (
              <p className="mt-3 max-w-3xl text-muted-foreground">
                {project.description}
              </p>
            )}
          </div>

          {user?.role === "SUPER_ADMIN" && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/projects/${project.id}/requests`}>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Demandes
                </Link>
              </Button>

              {/* <Button
              asChild
              size="sm"
            >
              <Link
                href={`/projects/${project.id}/tasks`}
              >
                <ListTodo className="mr-2 h-4 w-4" />
                Tâches
              </Link>
            </Button> */}

              <Button size="sm" asChild>
                <Link href={`/projects/${project.id}/tasks`}>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Voir les tâches
                </Link>
              </Button>

              <Button variant="outline" size="sm" asChild>
                <Link href={`/projects/${project.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier
                </Link>
              </Button>

              <DeleteProjectButton projectId={project.id} />
            </div>
          )}

          {user?.role !== "SUPER_ADMIN" && (
            <JoinProjectButton
              projectId={project.id}
              competences={project.competences}
              onSuccess={() => {
                loadProject();
                loadMembers();
              }}
            />
          )}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Dates */}
        <Card>
          <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
            {/* Date de début */}
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
                <CalendarDays className="size-6 text-muted-foreground" />
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date de début</p>

                <p className="font-medium">{formatDate(project.dateDebut)}</p>
              </div>
            </div>

            {/* Date de fin */}
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
                <CalendarDays className="size-6 text-muted-foreground" />
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date de fin</p>

                <p className="font-medium">
                  {project.dateFin
                    ? formatDate(project.dateFin)
                    : "Non définie"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compétences requises */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
                  <BriefcaseBusiness className="size-6 text-muted-foreground" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Compétences requises
                  </p>

                  <p className="font-medium">
                    {project.competences?.length ?? 0} compétence(s)
                  </p>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Compétences requises</DialogTitle>

              <DialogDescription>
                Voici les compétences recherchées pour ce projet.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              {project?.competences && project.competences.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">
                  Aucune compétence spécifique n&apos;est actuellement requise.
                </p>
              ) : project?.competences ? (
                project.competences.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <span className="font-medium">{item.competence.nom}</span>

                    <span className="text-sm text-muted-foreground">
                      {item.nombreMax} membre(s) recherché(s)
                    </span>
                  </div>
                ))
              ) : (
                <p className="py-4 text-sm text-muted-foreground">
                  Chargement…
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Membres */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Users className="size-6 text-muted-foreground" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Membres du projet
                  </p>

                  <p className="font-medium">
                    {members.length} / {project.nombreMembresMax}
                  </p>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>

          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Membres du projet</DialogTitle>

              <DialogDescription>
                Consultez les membres participant à ce projet et gérez leurs
                informations.
              </DialogDescription>
            </DialogHeader>

            {loadingMembers ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : (
              <ProjectMembers
                projectId={project.id}
                members={members}
                isSuperAdmin={user?.role === "SUPER_ADMIN"}
                onUpdate={loadMembers}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Tâches */}
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <CheckSquare className="h-7 w-7 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">Tâches</p>

              <p className="font-medium">{project._count.taches}</p>
            </div>
          </CardContent>
        </Card>
      </div>
 
    </div>
  );
}
