/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateTacheDto } from './dto/create-tache.dto';
import {
  RoleProjet,
  RoleUtilisateur,
  StatutMembre,
  StatutTache,
} from 'src/generated/prisma/client';
import { UpdateTacheDto } from './dto/update-tache.dto';

@Injectable()
export class TachesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(projetId: number, userId: number, dto: CreateTacheDto) {
    // 1. Vérifier que le projet existe

    const projet = await this.prisma.projet.findUnique({
      where: {
        id: projetId,
      },
    });

    if (!projet) {
      throw new NotFoundException('Projet introuvable');
    }

    // 2. Récupérer l'utilisateur connecté

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // 3. Vérifier si l'utilisateur est membre du projet

    const membre = await this.prisma.membreProjet.findUnique({
      where: {
        userId_projetId: {
          userId,
          projetId,
        },
      },
    });

    // Le Super Admin peut gérer les tâches
    // même s'il n'est pas membre du projet.
    if (
      user.role !== RoleUtilisateur.SUPER_ADMIN &&
      (!membre || membre.statut !== StatutMembre.ACTIF)
    ) {
      throw new ForbiddenException('Vous devez être membre actif du projet');
    }

    // 4. Déterminer les permissions

    const isSuperAdmin = user.role === RoleUtilisateur.SUPER_ADMIN;

    const isChefProjet =
      membre?.role === RoleProjet.CHEF_PROJET &&
      membre?.statut === StatutMembre.ACTIF;

    const peutAssigner = isSuperAdmin || isChefProjet;

    // 5. Vérifier l'assignation

    if (dto.assigneeId) {
      // Un utilisateur normal ne peut assigner
      // une tâche qu'à lui-même.
      if (dto.assigneeId !== userId && !peutAssigner) {
        throw new ForbiddenException(
          'Vous ne pouvez pas assigner une tâche à un autre membre',
        );
      }

      // Vérifier que l'assignee appartient
      // au même projet et qu'il est actif.
      const assignee = await this.prisma.membreProjet.findUnique({
        where: {
          userId_projetId: {
            userId: dto.assigneeId,
            projetId,
          },
        },
      });

      if (!assignee || assignee.statut !== StatutMembre.ACTIF) {
        throw new BadRequestException(
          'L’utilisateur assigné doit être un membre actif du projet',
        );
      }
    }

    // 6. Vérifier la tâche parent

    if (dto.parentId) {
      const parent = await this.prisma.tache.findFirst({
        where: {
          id: dto.parentId,
          projetId,
        },
      });

      if (!parent) {
        throw new BadRequestException(
          'La tâche parent n’existe pas dans ce projet',
        );
      }
    }

    // 7. Vérifier les dates

    if (dto.dateDebut && dto.dateEcheance) {
      const dateDebut = new Date(dto.dateDebut);

      const dateEcheance = new Date(dto.dateEcheance);

      if (dateDebut >= dateEcheance) {
        throw new BadRequestException(
          'La date de début doit être antérieure à la date d’échéance',
        );
      }
    }

    // 8. Créer la tâche

    return this.prisma.tache.create({
      data: {
        titre: dto.titre,

        description: dto.description,

        priorite: dto.priorite,

        statut: StatutTache.A_FAIRE,

        dateDebut: dto.dateDebut ? new Date(dto.dateDebut) : undefined,

        dateEcheance: dto.dateEcheance ? new Date(dto.dateEcheance) : undefined,

        projetId,

        createdById: userId,

        assigneeId: dto.assigneeId,

        parentId: dto.parentId,
      },

      include: {
        createdBy: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
          },
        },

        assignee: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
          },
        },

        parent: {
          select: {
            id: true,
            titre: true,
          },
        },
      },
    });
  }

  async remove(projetId: number, tacheId: number, userId: number) {
    const tache = await this.prisma.tache.findFirst({
      where: {
        id: tacheId,
        projetId,
      },
    });

    if (!tache) {
      throw new NotFoundException('Tâche introuvable');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const membre = await this.prisma.membreProjet.findUnique({
      where: {
        userId_projetId: {
          userId,
          projetId,
        },
      },
    });

    const isSuperAdmin = user.role === RoleUtilisateur.SUPER_ADMIN;

    const isChefProjet =
      membre?.role === RoleProjet.CHEF_PROJET &&
      membre?.statut === StatutMembre.ACTIF;

    const isCreateur = tache.createdById === userId;

    if (!isSuperAdmin && !isChefProjet && !isCreateur) {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que vos propres tâches',
      );
    }

    await this.prisma.tache.delete({
      where: {
        id: tacheId,
      },
    });

    return {
      message: 'Tâche supprimée avec succès',
    };
  }

  async update(
    projetId: number,
    tacheId: number,
    userId: number,
    dto: UpdateTacheDto,
  ) {
    const tache = await this.prisma.tache.findFirst({
      where: {
        id: tacheId,
        projetId,
      },
    });

    if (!tache) {
      throw new NotFoundException('Tâche introuvable');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // Super Admin
    const isSuperAdmin = user.role === RoleUtilisateur.SUPER_ADMIN;

    // Vérifier le membre du projet
    const membre = await this.prisma.membreProjet.findUnique({
      where: {
        userId_projetId: {
          userId,
          projetId,
        },
      },
    });

    const isChefProjet =
      membre?.role === RoleProjet.CHEF_PROJET &&
      membre?.statut === StatutMembre.ACTIF;

    const isCreateur = tache.createdById === userId;

    // Vérification des droits
    if (!isSuperAdmin && !isChefProjet && !isCreateur) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que vos propres tâches',
      );
    }

    // Vérifier l'assignee
    if (dto.assigneeId) {
      const assignee = await this.prisma.membreProjet.findUnique({
        where: {
          userId_projetId: {
            userId: dto.assigneeId,
            projetId,
          },
        },
      });

      if (!assignee || assignee.statut !== StatutMembre.ACTIF) {
        throw new BadRequestException(
          'Le destinataire doit être un membre actif du projet',
        );
      }
    }

    return this.prisma.tache.update({
      where: {
        id: tacheId,
      },

      data: {
        titre: dto.titre,
        description: dto.description,
        priorite: dto.priorite,
        statut: dto.statut,

        dateEcheance: dto.dateEcheance ? new Date(dto.dateEcheance) : undefined,

        assigneeId: dto.assigneeId,
      },

      include: {
        createdBy: true,
        assignee: true,
      },
    });
  }

  async findOne(projetId: number, tacheId: number) {
    const tache = await this.prisma.tache.findFirst({
      where: {
        id: tacheId,
        projetId,
      },

      include: {
        createdBy: {
          select: {
            id: true,
            nom: true,
            prenom: true,
          },
        },

        assignee: {
          select: {
            id: true,
            nom: true,
            prenom: true,
          },
        },

        sousTaches: {
      include: {
            assignee: true,
      },
      },
    }});

    if (!tache) {
      throw new NotFoundException('Tâche introuvable');
    }

    return tache;
  }

  async findAllByProjet(projetId: number) {
    const projet = await this.prisma.projet.findUnique({
      where: {
        id: projetId,
      },
    });

    if (!projet) {
      throw new NotFoundException('Projet introuvable');
    }

    return this.prisma.tache.findMany({
      where: {
        projetId,
      },

      include: {
        createdBy: {
          select: {
            id: true,
            nom: true,
            prenom: true,
          },
        },

        assignee: {
          select: {
            id: true,
            nom: true,
            prenom: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async ajouterDependance(
    projetId: number,
    tacheId: number,
    userId: number,
    dependanceId: number,
  ) {
    // 1. Vérifier que les deux tâches existent

    const tache = await this.prisma.tache.findFirst({
      where: {
        id: tacheId,
        projetId,
      },
    });

    if (!tache) {
      throw new NotFoundException('Tâche principale introuvable');
    }

    const dependance = await this.prisma.tache.findFirst({
      where: {
        id: dependanceId,
        projetId,
      },
    });

    if (!dependance) {
      throw new NotFoundException(
        'Tâche de dépendance introuvable dans ce projet',
      );
    }

    // 2. Une tâche ne peut pas dépendre
    //    d'elle-même

    if (tacheId === dependanceId) {
      throw new BadRequestException(
        'Une tâche ne peut pas dépendre d’elle-même',
      );
    }

    // 3. Vérifier les permissions

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const membre = await this.prisma.membreProjet.findUnique({
      where: {
        userId_projetId: {
          userId,
          projetId,
        },
      },
    });

    const isSuperAdmin = user.role === RoleUtilisateur.SUPER_ADMIN;

    const isChefProjet =
      membre?.role === RoleProjet.CHEF_PROJET &&
      membre?.statut === StatutMembre.ACTIF;

    const isCreateur = tache.createdById === userId;

    if (!isSuperAdmin && !isChefProjet && !isCreateur) {
      throw new ForbiddenException(
        'Vous n’avez pas le droit de modifier les dépendances de cette tâche',
      );
    }

    // 4. Vérifier si la dépendance existe déjà

    const existante = await this.prisma.tacheDependance.findUnique({
      where: {
        tacheId_dependanceId: {
          tacheId,
          dependanceId,
        },
      },
    });

    if (existante) {
      throw new ConflictException('Cette dépendance existe déjà');
    }

    // 5. Vérifier les cycles

    const cycle = await this.verifierCycle(tacheId, dependanceId);

    if (cycle) {
      throw new BadRequestException(
        'Cette dépendance créerait une boucle entre les tâches',
      );
    }

    // 6. Créer la dépendance

    return this.prisma.tacheDependance.create({
      data: {
        tacheId,
        dependanceId,
      },

      include: {
        dependance: {
          select: {
            id: true,
            titre: true,
            statut: true,
          },
        },
      },
    });
  }

  private async verifierCycle(
    tacheId: number,
    nouvelleDependanceId: number,
  ): Promise<boolean> {
    const visitees = new Set<number>();

    const explorer = async (id: number): Promise<boolean> => {
      // On revient à la tâche de départ
      if (id === tacheId) {
        return true;
      }

      // Déjà visitée
      if (visitees.has(id)) {
        return false;
      }

      visitees.add(id);

      const dependances = await this.prisma.tacheDependance.findMany({
        where: {
          tacheId: id,
        },

        select: {
          dependanceId: true,
        },
      });

      for (const dep of dependances) {
        if (await explorer(dep.dependanceId)) {
          return true;
        }
      }

      return false;
    };

    return explorer(nouvelleDependanceId);
  }

  async getDependances(projetId: number, tacheId: number) {
    const tache = await this.prisma.tache.findFirst({
      where: {
        id: tacheId,
        projetId,
      },
    });

    if (!tache) {
      throw new NotFoundException('Tâche introuvable');
    }

    return this.prisma.tacheDependance.findMany({
      where: {
        tacheId,
      },

      include: {
        dependance: {
          select: {
            id: true,
            titre: true,
            statut: true,
            priorite: true,
            dateEcheance: true,
          },
        },
      },
    });
  }

  async supprimerDependance(
    projetId: number,
    tacheId: number,
    dependanceId: number,
    userId: number,
  ) {
    const tache = await this.prisma.tache.findFirst({
      where: {
        id: tacheId,
        projetId,
      },
    });

    if (!tache) {
      throw new NotFoundException('Tâche introuvable');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const membre = await this.prisma.membreProjet.findUnique({
      where: {
        userId_projetId: {
          userId,
          projetId,
        },
      },
    });

    const isSuperAdmin = user.role === RoleUtilisateur.SUPER_ADMIN;

    const isChefProjet =
      membre?.role === RoleProjet.CHEF_PROJET &&
      membre?.statut === StatutMembre.ACTIF;

    const isCreateur = tache.createdById === userId;

    if (!isSuperAdmin && !isChefProjet && !isCreateur) {
      throw new ForbiddenException(
        'Vous n’avez pas le droit de supprimer cette dépendance',
      );
    }

    const dependance = await this.prisma.tacheDependance.findUnique({
      where: {
        tacheId_dependanceId: {
          tacheId,
          dependanceId,
        },
      },
    });

    if (!dependance) {
      throw new NotFoundException('Dépendance introuvable');
    }

    await this.prisma.tacheDependance.delete({
      where: {
        id: dependance.id,
      },
    });

    return {
      message: 'Dépendance supprimée avec succès',
    };
  }

  async changerStatut(
    projetId: number,
    tacheId: number,
    userId: number,
    nouveauStatut: StatutTache,
  ) {
    // 1. Vérifier la tâche
    const tache = await this.prisma.tache.findFirst({
      where: {
        id: tacheId,
        projetId,
      },
    });

    if (!tache) {
      throw new NotFoundException('Tâche introuvable');
    }

    // 2. Vérifier l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // 3. Vérifier son appartenance au projet
    const membre = await this.prisma.membreProjet.findUnique({
      where: {
        userId_projetId: {
          userId,
          projetId,
        },
      },
    });

    const isSuperAdmin = user.role === RoleUtilisateur.SUPER_ADMIN;

    const isChefProjet =
      membre?.role === RoleProjet.CHEF_PROJET &&
      membre?.statut === StatutMembre.ACTIF;

    const isAssignee = tache.assigneeId === userId;

    // 4. Vérifier les permissions
    if (!isSuperAdmin && !isChefProjet && !isAssignee) {
      throw new ForbiddenException(
        'Vous ne pouvez pas modifier le statut de cette tâche',
      );
    }

    // 5. Si on veut démarrer ou terminer la tâche,
    // vérifier ses dépendances
    if (
      nouveauStatut === StatutTache.EN_COURS ||
      nouveauStatut === StatutTache.TERMINEE
    ) {
      const dependances = await this.prisma.tacheDependance.findMany({
        where: {
          tacheId,
        },
        include: {
          dependance: {
            select: {
              id: true,
              titre: true,
              statut: true,
            },
          },
        },
      });

      const dependancesNonTerminees = dependances.filter(
        (dep) => dep.dependance.statut !== StatutTache.TERMINEE,
      );

      if (dependancesNonTerminees.length > 0) {
        throw new BadRequestException({
          message: 'Cette tâche est bloquée par des tâches non terminées',
          tachesBloquantes: dependancesNonTerminees.map((dep) => ({
            id: dep.dependance.id,
            titre: dep.dependance.titre,
            statut: dep.dependance.statut,
          })),
        });
      }
    }

    // 6. Modifier le statut
    return this.prisma.tache.update({
      where: {
        id: tacheId,
      },
      data: {
        statut: nouveauStatut,
      },
    });
  }
}
