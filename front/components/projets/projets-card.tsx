// // // import Link from "next/link";

// // // import {
// // //   CalendarDays,
// // //   CheckSquare,
// // //   Users,
// // // } from "lucide-react";

// // // import { Projet } from "@/types/projet";

// // // import { StatutBadge } from "./statut-badge";
 
// // // import {
// // //   Card,
// // //   CardContent,
// // //   CardFooter,
// // //   CardHeader,
// // //   CardTitle,
// // // } from "@/components/ui/card";

// // // import { Button } from "@/components/ui/button";

// // // interface ProjectCardProps {
// // //   project: Projet;
// // // }

// // // function formatDate(date: string) {
// // //   return new Intl.DateTimeFormat(
// // //     "fr-FR",
// // //     {
// // //       day: "2-digit",
// // //       month: "short",
// // //       year: "numeric",
// // //     },
// // //   ).format(new Date(date));
// // // }

// // // export function ProjectCard({
// // //   project,
// // // }: ProjectCardProps) {
// // //   return (
// // //     <Card className="flex h-full flex-col">
// // //       <CardHeader>
// // //         <div className="flex items-start justify-between gap-4">
// // //           <CardTitle className="line-clamp-1">
// // //             {project.nom}
// // //           </CardTitle>

// // //           <StatutBadge
// // //             statut={project.statut}
// // //           />
// // //         </div>

// // //         {project.description && (
// // //           <p className="line-clamp-2 text-sm text-muted-foreground">
// // //             {project.description}
// // //           </p>
// // //         )}
// // //       </CardHeader>

// // //       <CardContent className="flex-1 space-y-3">
// // //         <div className="flex items-center gap-2 text-sm text-muted-foreground">
// // //           <CalendarDays className="h-4 w-4" />

// // //           <span>
// // //             Début :{" "}
// // //             {formatDate(project.dateDebut)}
// // //           </span>
// // //         </div>

// // //         {project.dateFin && (
// // //           <div className="flex items-center gap-2 text-sm text-muted-foreground">
// // //             <CalendarDays className="h-4 w-4" />

// // //             <span>
// // //               Fin :{" "}
// // //               {formatDate(project.dateFin)}
// // //             </span>
// // //           </div>
// // //         )}

// // //         <div className="flex items-center gap-2 text-sm text-muted-foreground">
// // //           <Users className="h-4 w-4" />

// // //           <span>
// // //             {project._count.membres}/
// // //             {project.nombreMembresMax} membres
// // //           </span>
// // //         </div>

// // //         <div className="flex items-center gap-2 text-sm text-muted-foreground">
// // //           <CheckSquare className="h-4 w-4" />

// // //           <span>
// // //             {project._count.taches} tâches
// // //           </span>
// // //         </div>
// // //       </CardContent>

// // //       <CardFooter>
// // //         <Button
// // //           asChild
// // //           variant="outline"
// // //           className="w-full"
// // //         >
// // //           <Link href={`/projects/${project.id}`}>
// // //             Voir le projet
// // //           </Link>
// // //         </Button>
// // //       </CardFooter>
// // //     </Card>
// // //   );
// // // }

// // // components/projets/projets-card.tsx
// // import Link from "next/link";

// // import {
// //   CalendarDays,
// //   CheckSquare,
// //   Users,
// // } from "lucide-react";

// // import { Projet } from "@/types/projet";

// // import { StatutBadge } from "./statut-badge";
 
// // import {
// //   Card,
// //   CardContent,
// //   CardFooter,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";

// // import { Button } from "@/components/ui/button";
 
// // interface ProjectCardProps {
// //   project: Projet;
// //   isMember?: boolean; // nouveau
// // }

// // function formatDate(date: string) {
// //   return new Intl.DateTimeFormat(
// //     "fr-FR",
// //     {
// //       day: "2-digit",
// //       month: "short",
// //       year: "numeric",
// //     },
// //   ).format(new Date(date));
// // }

// // export function ProjectCard({
// //   project,
// //   isMember = false,
// // }: ProjectCardProps) {
// //   return (
// //     <Card
// //       className={`flex h-full flex-col ${
// //         isMember
// //           ? "border-primary bg-primary/5"
// //           : ""
// //       }`}
// //     >
// //       <CardHeader>
// //         <div className="flex items-start justify-between gap-4">
// //           <CardTitle className="line-clamp-1">
// //             {project.nom}
// //           </CardTitle>

// //           <StatutBadge
// //             statut={project.statut}
// //           />
// //         </div>

// //         {project.description && (
// //           <p className="line-clamp-2 text-sm text-muted-foreground">
// //             {project.description}
// //           </p>
// //         )}

// //         {isMember && (
// //           <p className="mt-2 text-xs font-medium text-primary">
// //             Vous êtes membre de ce projet
// //           </p>
// //         )}
// //       </CardHeader>

// //       <CardContent className="flex-1 space-y-3">
// //         <div className="flex items-center gap-2 text-sm text-muted-foreground">
// //           <CalendarDays className="h-4 w-4" />

// //           <span>
// //             Début :{" "}
// //             {formatDate(project.dateDebut)}
// //           </span>
// //         </div>

// //         {project.dateFin && (
// //           <div className="flex items-center gap-2 text-sm text-muted-foreground">
// //             <CalendarDays className="h-4 w-4" />

// //             <span>
// //               Fin :{" "}
// //               {formatDate(project.dateFin)}
// //             </span>
// //           </div>
// //         )}

// //         <div className="flex items-center gap-2 text-sm text-muted-foreground">
// //           <Users className="h-4 w-4" />

// //           <span>
// //             {project._count.membres}/
// //             {project.nombreMembresMax} membres
// //           </span>
// //         </div>

// //         <div className="flex items-center gap-2 text-sm text-muted-foreground">
// //           <CheckSquare className="h-4 w-4" />

// //           <span>
// //             {project._count.taches} tâches
// //           </span>
// //         </div>
// //       </CardContent>

// //       <CardFooter className="flex gap-2">
// //         <Button
// //           asChild
// //           variant={isMember ? "default" : "outline"}
// //           className="flex-1"
// //         >
// //           <Link href={`/projects/${project.id}`}>
// //             {isMember ? "Voir le projet" : "Voir le projet"}
// //           </Link>
// //         </Button>

// //         {!isMember && (
// //           <Button
// //             variant="secondary"
// //             // Tu pourras brancher un onClick pour appeler ton API "rejoindre"
// //             // onClick={() => handleJoin(project.id)}
// //           >
// //             Rejoindre
// //           </Button>
// //         )}
// //       </CardFooter>
// //     </Card>
// //   );
// // }





















// // components/projets/projets-card.tsx
// import { useState } from "react";

// import Link from "next/link";

// import {
//   CalendarDays,
//   CheckSquare,
//   Users,
// } from "lucide-react";

// import { ProjetDetail, ProjetCompetence } from "@/types/projet";

// import { StatutBadge } from "./statut-badge";

// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { Button } from "@/components/ui/button";

// import { JoinProjectDialog } from "./join-project-dialog";

// interface ProjectCardProps {
//   project: ProjetDetail;
//   isMember?: boolean;
//   competences?: ProjetCompetence[];
//   onJoined?: () => void;
// }

// function formatDate(date: string) {
//   return new Intl.DateTimeFormat(
//     "fr-FR",
//     {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     },
//   ).format(new Date(date));
// }

// export function ProjectCard({
//   project,
//   isMember = false,
//   competences = [],
//   onJoined,
// }: ProjectCardProps) {
//   const [openJoin, setOpenJoin] = useState(false);

//   return (
//     <>
//       <Card
//         className={`flex h-full flex-col ${
//           isMember
//             ? "border-primary bg-primary/5"
//             : ""
//         }`}
//       >
//         <CardHeader>
//           <div className="flex items-start justify-between gap-4">
//             <CardTitle className="line-clamp-1">
//               {project.nom}
//             </CardTitle>

//             <StatutBadge
//               statut={project.statut}
//             />
//           </div>

//           {project.description && (
//             <p className="line-clamp-2 text-sm text-muted-foreground">
//               {project.description}
//             </p>
//           )}

//           {isMember && (
//             <p className="mt-2 text-xs font-medium text-primary">
//               Vous êtes membre de ce projet
//             </p>
//           )}
//         </CardHeader>

//         <CardContent className="flex-1 space-y-3">
//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <CalendarDays className="h-4 w-4" />

//             <span>
//               Début :{" "}
//               {formatDate(project.dateDebut)}
//             </span>
//           </div>

//           {project.dateFin && (
//             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//               <CalendarDays className="h-4 w-4" />

//               <span>
//                 Fin :{" "}
//                 {formatDate(project.dateFin)}
//               </span>
//             </div>
//           )}

//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <Users className="h-4 w-4" />

//             <span>
//               {project._count.membres}/
//               {project.nombreMembresMax} membres
//             </span>
//           </div>

//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <CheckSquare className="h-4 w-4" />

//             <span>
//               {project._count.taches} tâches
//             </span>
//           </div>
//         </CardContent>

//         <CardFooter className="flex gap-2">
//           <Button
//             asChild
//             variant={isMember ? "default" : "outline"}
//             className="flex-1"
//           >
//             <Link href={`/projects/${project.id}`}>
//               {isMember ? "Voir le projet" : "Voir le projet"}
//             </Link>
//           </Button>

//           {!isMember && (
//             <Button
//               variant="secondary"
//               onClick={() => setOpenJoin(true)}
//               disabled={competences.length === 0}
//             >
//               Rejoindre
//             </Button>
//           )}
//         </CardFooter>
//       </Card>

//       <JoinProjectDialog
//         open={openJoin}
//         onOpenChange={setOpenJoin}
//         projectId={project.id}
//         competences={competences}
//         onSuccess={() => {
//           setOpenJoin(false);
//           onJoined?.();
//         }}
//       />
//     </>
//   );
// }








"use client";

import { useState } from "react";

import Link from "next/link";

import {
  CalendarDays,
  CheckSquare,
  Users,
} from "lucide-react";

import { ProjetDetail, ProjetCompetence } from "@/types/projet";

import { StatutBadge } from "./statut-badge";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { JoinProjectDialog } from "./join-project-dialog";

interface ProjectCardProps {
  project: ProjetDetail;
  isMember?: boolean;
  competences?: ProjetCompetence[];
  onJoined?: () => void;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function ProjectCard({
  project,
  isMember = false,
  competences = [],
  onJoined,
}: ProjectCardProps) {
  const [openJoin, setOpenJoin] = useState(false);

  return (
    <>
      <Card
        className={`flex h-full flex-col ${
          isMember ? "border-primary bg-primary/5" : ""
        }`}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="line-clamp-1">{project.nom}</CardTitle>

            <StatutBadge statut={project.statut} />
          </div>

          {project.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {project.description}
            </p>
          )}

          {isMember && (
            <p className="mt-2 text-xs font-medium text-primary">
              Vous êtes membre de ce projet
            </p>
          )}
        </CardHeader>

        <CardContent className="flex-1 space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />

            <span>Début : {formatDate(project.dateDebut)}</span>
          </div>

          {project.dateFin && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />

              <span>Fin : {formatDate(project.dateFin)}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />

            <span>
              {project._count.membres}/{project.nombreMembresMax} membres
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckSquare className="h-4 w-4" />

            <span>{project._count.taches} tâches</span>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            asChild
            variant={isMember ? "default" : "outline"}
            className="flex-1"
          >
            <Link href={`/projects/${project.id}`}>
              {isMember ? "Voir le projet" : "Voir le projet"}
            </Link>
          </Button>

          {!isMember && (
            <Button
              variant="secondary"
              onClick={() => setOpenJoin(true)}
              disabled={competences.length === 0}
            >
              Rejoindre
            </Button>
          )}
        </CardFooter>
      </Card>

      <JoinProjectDialog
        open={openJoin}
        onOpenChange={setOpenJoin}
        projectId={project.id}
        competences={competences}
        onSuccess={() => {
          setOpenJoin(false);
          onJoined?.();
        }}
      />
    </>
  );
}