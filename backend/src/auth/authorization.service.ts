import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  RoleProjet,
  RoleUtilisateur,
  StatutMembre,
} from 'src/generated/prisma/client';

@Injectable()
export class AuthorizationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Vérifie si l'utilisateur est Super Admin.
   */
  isSuperAdmin(userRole: RoleUtilisateur): boolean {
    return userRole === RoleUtilisateur.SUPER_ADMIN;
  }

  /**
   * Récupère l'appartenance d'un utilisateur à un projet.
   */
  async getProjectMembership(userId: number, projetId: number) {
    const membership = await this.prisma.membreProjet.findUnique({
      where: {
        userId_projetId: {
          userId,
          projetId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Vous ne faites pas partie de ce projet');
    }

    if (membership.statut !== StatutMembre.ACTIF) {
      throw new ForbiddenException(
        'Votre adhésion à ce projet n’est plus active',
      );
    }

    return membership;
  }

  /**
   * Vérifie que l'utilisateur est membre du projet.
   */
  async isProjectMember(userId: number, projetId: number): Promise<boolean> {
    const membership = await this.prisma.membreProjet.findUnique({
      where: {
        userId_projetId: {
          userId,
          projetId,
        },
      },
    });

    return !!membership && membership.statut === StatutMembre.ACTIF;
  }

  /**
   * Vérifie que l'utilisateur est chef du projet.
   */
  async isProjectLeader(userId: number, projetId: number): Promise<boolean> {
    const membership = await this.prisma.membreProjet.findUnique({
      where: {
        userId_projetId: {
          userId,
          projetId,
        },
      },
    });

    return (
      !!membership &&
      membership.statut === StatutMembre.ACTIF &&
      membership.role === RoleProjet.CHEF_PROJET
    );
  }

  /**
   * Vérifie l'accès général à un projet.
   *
   * Super Admin : accès global
   * Membre/Chef : accès à leur projet uniquement
   */
  async canAccessProject(
    userId: number,
    userRole: RoleUtilisateur,
    projetId: number,
  ): Promise<boolean> {
    if (userRole === RoleUtilisateur.SUPER_ADMIN) {
      return true;
    }

    return this.isProjectMember(userId, projetId);
  }

  /**
   * Vérifie si l'utilisateur peut gérer
   * les tâches d'un projet.
   *
   * Super Admin : tous les projets
   * Chef Projet : son projet
   * Membre : uniquement ses propres tâches
   */
  async canManageProjectTasks(
    userId: number,
    userRole: RoleUtilisateur,
    projetId: number,
  ): Promise<boolean> {
    // Super Admin = accès global
    if (userRole === RoleUtilisateur.SUPER_ADMIN) {
      return true;
    }

    // Chef projet = accès aux tâches de son projet
    return this.isProjectLeader(userId, projetId);
  }

  async canModifyTask(
    userId: number,
    userRole: RoleUtilisateur,
    taskId: number,
  ): Promise<boolean> {
    const task = await this.prisma.tache.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new NotFoundException('Tâche introuvable');
    }

    // Super Admin = CRUD sur toutes les tâches
    if (userRole === RoleUtilisateur.SUPER_ADMIN) {
      return true;
    }

    // Chef projet = CRUD sur les tâches de son projet
    const isLeader = await this.isProjectLeader(userId, task.projetId);

    if (isLeader) {
      return true;
    }

    // Utilisateur normal = uniquement
    // les tâches qu'il a créées
    return task.createdById === userId;
  }
}
