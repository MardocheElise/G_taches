"use client";

import { useState } from "react";

import {
  Crown,
  Loader2,
  MoreHorizontal,
  UserRound,
  UserRoundCheck,
  UserX,
} from "lucide-react";

 

import {
  projectsApi,
} from "@/lib/api/projects";

import {
  useAuth,
} from "@/components/providers/auth-provider";

import {
  Button,
} from "@/components/ui/button";

import {
  Badge,
} from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MembreProjet } from "@/types/membre";

interface ProjectMembersProps {
  projectId: number;
  members: MembreProjet[];
  isSuperAdmin: boolean;
  onUpdate: () => void;
}

export function ProjectMembers({
  projectId,
  members,
  isSuperAdmin,
  onUpdate,
}: ProjectMembersProps) {
  const { token } = useAuth();

  const [
    loadingId,
    setLoadingId,
  ] = useState<number | null>(
    null,
  );

  const [error, setError] =
    useState("");

  const projectManager = members.find(
    (member) =>
      member.role === "CHEF_PROJET",
  );

  async function handleDesignate(
    memberId: number,
  ) {
    if (!token) return;

    try {
      setLoadingId(memberId);
      setError("");

      await projectsApi.designateProjectManager(
        projectId,
        memberId,
        token,
      );

      onUpdate();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de désigner le chef de projet.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function handleChangeManager(
    memberId: number,
  ) {
    if (!token) return;

    try {
      setLoadingId(memberId);
      setError("");

      await projectsApi.changeProjectManager(
        projectId,
        memberId,
        token,
      );

      onUpdate();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de changer le chef de projet.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function handleRemove(
    memberId: number,
  ) {
    if (!token) return;

    const confirmed = window.confirm(
      "Voulez-vous vraiment retirer ce membre du projet ?",
    );

    if (!confirmed) return;

    try {
      setLoadingId(memberId);
      setError("");

      await projectsApi.removeMember(
        projectId,
        memberId,
        token,
      );

      onUpdate();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de retirer ce membre.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-10 text-center">
        <UserRound className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

        <p className="font-medium">
          Aucun membre actif
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Les membres acceptés apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {members.map((member) => {
        const isLoading =
          loadingId === member.id;

        const isManager =
          member.role === "CHEF_PROJET";

        return (
          <div
            key={member.id}
            className="flex items-center justify-between gap-4 rounded-lg border p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                {isManager ? (
                  <Crown className="h-5 w-5 text-primary" />
                ) : (
                  <UserRound className="h-5 w-5 text-primary" />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate font-medium">
                  {member.user?.prenom}{" "}
                  {member.user?.nom}
                </p>

                <p className="truncate text-sm text-muted-foreground">
                  {member.competence?.nom ??
                    "Compétence non précisée"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isManager ? (
                <Badge>
                  <Crown className="mr-1 h-3 w-3" />
                  Chef de projet
                </Badge>
              ) : (
                <Badge variant="secondary">
                  Membre
                </Badge>
              )}

              {isSuperAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MoreHorizontal className="h-4 w-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                  >
                    {!isManager && !projectManager && (
                      <DropdownMenuItem
                        onClick={() =>
                          handleDesignate(member.id)
                        }
                      >
                        <UserRoundCheck className="mr-2 h-4 w-4" />

                        Désigner chef de projet
                      </DropdownMenuItem>
                    )}

                    {!isManager && projectManager && (
                      <DropdownMenuItem
                        onClick={() =>
                          handleChangeManager(member.id)
                        }
                      >
                        <Crown className="mr-2 h-4 w-4" />

                        Faire nouveau chef
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() =>
                        handleRemove(member.id)
                      }
                    >
                      <UserX className="mr-2 h-4 w-4" />

                      Retirer du projet
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
