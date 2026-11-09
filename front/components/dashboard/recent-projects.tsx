import Link from "next/link";

import {
Card,
CardContent,
CardHeader,
CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { StatutBadge } from "@/components/projets/statut-badge";

import { DernierProjet } from "@/types/dashboard";

interface RecentProjectsProps {
projects: DernierProjet[];
}

export function RecentProjects({
projects,
}: RecentProjectsProps) {
return ( <Card> <CardHeader className="flex flex-row items-center justify-between"> <CardTitle>
Derniers projets </CardTitle>

    <Button
      asChild
      variant="outline"
      size="sm"
    >
      <Link href="/projects">
        Voir tous
      </Link>
    </Button>
  </CardHeader>

  <CardContent>
    {projects.length === 0 ? (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Aucun projet disponible.
      </p>
    ) : (
      <div className="space-y-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate font-medium">
                  {project.nom}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Créé par{" "}
                  {project.createdBy.prenom}{" "}
                  {project.createdBy.nom}
                </p>

                <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                  <span>
                    {project._count.membres} membres
                  </span>

                  <span>
                    {project._count.taches} tâches
                  </span>
                </div>
              </div>

              <StatutBadge
                statut={project.statut}
              />
            </div>
          </Link>
        ))}
      </div>
    )}
  </CardContent>
</Card>

);
}
