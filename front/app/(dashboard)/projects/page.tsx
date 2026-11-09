// "use client";

// import {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import Link from "next/link";

// import {
//   FolderKanban,
//   Plus,
// } from "lucide-react";

// import { useAuth } from "@/components/providers/auth-provider";

// import { projectsApi } from "@/lib/api/projects";

// import {
//   Projet,
//   StatutProjet,
// } from "@/types/projet";

// import { Button } from "@/components/ui/button";

// import { ProjectFilters } from "@/components/projets/project-filters";
// import { ProjectCard } from "@/components/projets/projets-card";

// export default function ProjectsPage() {
//   const { token, user } = useAuth();

//   const [projects, setProjects] =
//     useState<Projet[]>([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   const [search, setSearch] =
//     useState("");

//   const [statut, setStatut] =
//     useState<StatutProjet | "TOUS">(
//       "TOUS",
//     );

//   useEffect(() => {
//     async function loadProjects() {
//       if (!token) {
//         return;
//       }

//       try {
//         setLoading(true);
//         setError("");

//         const data =
//           await projectsApi.getAll(token);

//         setProjects(data);
//       } catch (error) {
//         setError(
//           error instanceof Error
//             ? error.message
//             : "Impossible de charger les projets.",
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadProjects();
//   }, [token]);

//   const filteredProjects = useMemo(() => {
//     return projects.filter((project) => {
//       const matchesSearch =
//         project.nom
//           .toLowerCase()
//           .includes(
//             search.toLowerCase(),
//           ) ||
//         project.description
//           ?.toLowerCase()
//           .includes(
//             search.toLowerCase(),
//           );

//       const matchesStatut =
//         statut === "TOUS" ||
//         project.statut === statut;

//       return (
//         matchesSearch &&
//         matchesStatut
//       );
//     });
//   }, [
//     projects,
//     search,
//     statut,
//   ]);

//   if (loading) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center">
//         Chargement des projets...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="rounded-lg border p-6">
//         <p className="font-medium">
//           Impossible de charger les projets
//         </p>

//         <p className="mt-2 text-sm text-muted-foreground">
//           {error}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <h1 className="flex items-center gap-2 text-2xl font-bold">
//             <FolderKanban className="h-7 w-7" />

//             Projets
//           </h1>

//           <p className="mt-1 text-muted-foreground">
//             Consultez et gérez les projets de
//             la plateforme.
//           </p>
//         </div>

//         {user?.role === "SUPER_ADMIN" && (
//           <Button asChild>
//             <Link href="/projects/new">
//               <Plus className="mr-2 h-4 w-4" />

//               Créer un projet
//             </Link>
//           </Button>
//         )}
//       </div>

//       <ProjectFilters
//         search={search}
//         statut={statut}
//         onSearchChange={setSearch}
//         onStatutChange={setStatut}
//       />

//       <p className="text-sm text-muted-foreground">
//         {filteredProjects.length} projet
//         {filteredProjects.length > 1 ? "s" : ""}
//       </p>

//       {filteredProjects.length === 0 ? (
//         <div className="rounded-lg border border-dashed p-12 text-center">
//           <FolderKanban className="mx-auto h-10 w-10 text-muted-foreground" />

//           <h2 className="mt-4 font-semibold">
//             Aucun projet trouvé
//           </h2>

//           <p className="mt-2 text-sm text-muted-foreground">
//             Aucun projet ne correspond à votre
//             recherche.
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//           {filteredProjects.map(
//             (project) => (
//               <ProjectCard
//                 key={project.id}
//                 project={project}
//               />
//             ),
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

















// // app/projects/page.tsx (ou là où est ton ProjectsPage)
// "use client";

// import {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import Link from "next/link";

// import {
//   FolderKanban,
//   Plus,
// } from "lucide-react";

// import { useAuth } from "@/components/providers/auth-provider";

// import { projectsApi } from "@/lib/api/projects";

// import {
//   Projet,
//   StatutProjet,
//   ProjetDetail,
// } from "@/types/projet";

// import { Button } from "@/components/ui/button";

// import { ProjectFilters } from "@/components/projets/project-filters";
// import { ProjectCard } from "@/components/projets/projets-card";

// export default function ProjectsPage() {
//   const { token, user } = useAuth();

//   const [projects, setProjects] =
//     useState<ProjetDetail[]>([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   const [search, setSearch] =
//     useState("");

//   const [statut, setStatut] =
//     useState<StatutProjet | "TOUS">(
//       "TOUS",
//     );

//   useEffect(() => {
//     async function loadProjects() {
//       if (!token) {
//         return;
//       }

//       try {
//         setLoading(true);
//         setError("");

//         const data =
//           await projectsApi.getAll(token);

//         // Si ton API renvoie déjà des ProjetDetail, c’est bon.
//         setProjects(data as ProjetDetail[]);
//       } catch (error) {
//         setError(
//           error instanceof Error
//             ? error.message
//             : "Impossible de charger les projets.",
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadProjects();
//   }, [token]);

//   const filteredProjects = useMemo(() => {
//     return projects.filter((project) => {
//       const matchesSearch =
//         project.nom
//           .toLowerCase()
//           .includes(
//             search.toLowerCase(),
//           ) ||
//         project.description
//           ?.toLowerCase()
//           .includes(
//             search.toLowerCase(),
//           );

//       const matchesStatut =
//         statut === "TOUS" ||
//         project.statut === statut;

//       return (
//         matchesSearch &&
//         matchesStatut
//       );
//     });
//   }, [
//     projects,
//     search,
//     statut,
//   ]);

//   // Utilisateur est membre si son id est dans project.membres[].userId
// // Dans ProjectsPage

// const isUserMember = (project: ProjetDetail) => {
//   if (!user?.id) return false;

//   // Si membres n’est pas défini, on considère que l’utilisateur n’est pas membre
//   if (!Array.isArray(project.membres)) {
//     return false;
//   }

//   return project.membres.some(
//     (m) => m.userId === user.id,
//   );
// };

//   if (loading) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center">
//         Chargement des projets...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="rounded-lg border p-6">
//         <p className="font-medium">
//           Impossible de charger les projets
//         </p>

//         <p className="mt-2 text-sm text-muted-foreground">
//           {error}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <h1 className="flex items-center gap-2 text-2xl font-bold">
//             <FolderKanban className="h-7 w-7" />

//             Projets
//           </h1>

//           <p className="mt-1 text-muted-foreground">
//             Consultez et gérez les projets de
//             la plateforme.
//           </p>
//         </div>

//         {user?.role === "SUPER_ADMIN" && (
//           <Button asChild>
//             <Link href="/projects/new">
//               <Plus className="mr-2 h-4 w-4" />

//               Créer un projet
//             </Link>
//           </Button>
//         )}
//       </div>

//       <ProjectFilters
//         search={search}
//         statut={statut}
//         onSearchChange={setSearch}
//         onStatutChange={setStatut}
//       />

//       <p className="text-sm text-muted-foreground">
//         {filteredProjects.length} projet
//         {filteredProjects.length > 1 ? "s" : ""}
//       </p>

//       {filteredProjects.length === 0 ? (
//         <div className="rounded-lg border border-dashed p-12 text-center">
//           <FolderKanban className="mx-auto h-10 w-10 text-muted-foreground" />

//           <h2 className="mt-4 font-semibold">
//             Aucun projet trouvé
//           </h2>

//           <p className="mt-2 text-sm text-muted-foreground">
//             Aucun projet ne correspond à votre
//             recherche.
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//           {filteredProjects.map(
//             (project) => (
//     <ProjectCard
//       key={project.id}
//       project={project}
//       isMember={isUserMember(project)}
//       competences={project.competences} // ← ajouter
//       onJoin={() => handleJoin(project)} // ← ajouter
//     />

//             ),
//           )}
//         </div>
//       )}
//     </div>
//   );
// }















"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { FolderKanban, Plus } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { projectsApi } from "@/lib/api/projects";
import { ProjetDetail, StatutProjet } from "@/types/projet";

import { Button } from "@/components/ui/button";
import { ProjectFilters } from "@/components/projets/project-filters";
import { ProjectCard } from "@/components/projets/projets-card";

export default function ProjectsPage() {
  const { token, user } = useAuth();

  const [projects, setProjects] = useState<ProjetDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statut, setStatut] = useState<StatutProjet | "TOUS">("TOUS");

  useEffect(() => {
    async function loadProjects() {
      if (!token) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await projectsApi.getAll(token);

        setProjects(data as ProjetDetail[]);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Impossible de charger les projets.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [token]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.nom.toLowerCase().includes(search.toLowerCase()) ||
        project.description?.toLowerCase().includes(search.toLowerCase());

      const matchesStatut =
        statut === "TOUS" || project.statut === statut;

      return matchesSearch && matchesStatut;
    });
  }, [projects, search, statut]);

  const isUserMember = (project: ProjetDetail) => {
    if (!user?.id) return false;

    if (!Array.isArray(project.membres)) {
      return false;
    }

    return project.membres.some((m) => m.userId === user.id);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        Chargement des projets...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border p-6">
        <p className="font-medium">Impossible de charger les projets</p>

        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <FolderKanban className="h-7 w-7" />
            Projets
          </h1>

          <p className="mt-1 text-muted-foreground">
            Consultez et gérez les projets de la plateforme.
          </p>
        </div>

        {user?.role === "SUPER_ADMIN" && (
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              Créer un projet
            </Link>
          </Button>
        )}
      </div>

      <ProjectFilters
        search={search}
        statut={statut}
        onSearchChange={setSearch}
        onStatutChange={setStatut}
      />

      <p className="text-sm text-muted-foreground">
        {filteredProjects.length} projet{filteredProjects.length > 1 ? "s" : ""}
      </p>

      {filteredProjects.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <FolderKanban className="mx-auto h-10 w-10 text-muted-foreground" />

          <h2 className="mt-4 font-semibold">Aucun projet trouvé</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Aucun projet ne correspond à votre recherche.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isMember={isUserMember(project)}
              competences={project.competences}
              onJoined={async () => {
                if (!token) return;
                const data = await projectsApi.getAll(token);
                setProjects(data as ProjetDetail[]);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}