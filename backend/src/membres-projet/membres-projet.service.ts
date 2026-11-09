/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { RoleProjet, StatutMembre } from 'src/generated/prisma/client';

@Injectable()
export class MembresProjetService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Un utilisateur rejoint un projet.
   */
  async rejoindreProjet(userId: number, projetId: number) {
    // 1. Vérifier que le projet existe
    const projet = await this.prisma.projet.findUnique({
      where: {
        id: projetId,
      },

      include: {
        _count: {
          select: {
            membres: true,
          },
        },
      },
    });

    if (!projet) {
      throw new NotFoundException('Projet introuvable');
    }

    // 2. Vérifier si l'utilisateur est déjà membre
    const membreExistant = await this.prisma.membreProjet.findUnique({
      where: {
        userId_projetId: {
          userId,
          projetId,
        },
      },
    });

    if (membreExistant) {
      throw new ConflictException('Vous êtes déjà membre de ce projet');
    }

    // 3. Vérifier la capacité du projet
    if (projet._count.membres >= projet.nombreMembresMax) {
      throw new ConflictException('Le nombre maximum de membres est atteint');
    }

    // 4. Créer l'adhésion
    return this.prisma.membreProjet.create({
      data: {
        userId,
        projetId,
        role: RoleProjet.MEMBRE,
        statut: StatutMembre.EN_ATTENTE,
      },

      include: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
          },
        },

        projet: {
          select: {
            id: true,
            nom: true,
          },
        },
      },
    });
  }

  /**
   * Récupérer tous les membres d'un projet.
   */
  async findByProjet(projetId: number) {
    const projet = await this.prisma.projet.findUnique({
      where: {
        id: projetId,
      },
    });

    if (!projet) {
      throw new NotFoundException('Projet introuvable');
    }

    return this.prisma.membreProjet.findMany({
      where: {
        projetId,
      },

      include: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            competences: true,
          },
        },
      },

      orderBy: {
        dateIntegration: 'asc',
      },
    });
  }

  /**
   * Récupérer un membre précis.
   */
  async findOne(projetId: number, userId: number) {
    const membre = await this.prisma.membreProjet.findUnique({
      where: {
        userId_projetId: {
          userId,
          projetId,
        },
      },

      include: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            competences: true,
          },
        },
      },
    });

    if (!membre) {
      throw new NotFoundException('Membre introuvable dans ce projet');
    }

    return membre;
  }

  /**
   * Quitter un projet.
   */
  async quitterProjet(userId: number, projetId: number) {
    const membre = await this.findOne(projetId, userId);

    if (membre.role === RoleProjet.CHEF_PROJET) {
      throw new ForbiddenException(
        'Le chef de projet doit être remplacé avant de quitter le projet',
      );
    }

    return this.prisma.membreProjet.update({
      where: {
        id: membre.id,
      },

      data: {
        statut: StatutMembre.QUITTE,
      },
    });
  }

  async findDemandes(projetId: number) {
    const projet = await this.prisma.projet.findUnique({
      where: {
        id: projetId,
      },
    });

    if (!projet) {
      throw new NotFoundException('Projet introuvable');
    }

    return this.prisma.membreProjet.findMany({
      where: {
        projetId,
        statut: StatutMembre.EN_ATTENTE,
      },

      include: {
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            competences: true,
          },
        },
      },

      orderBy: {
        dateIntegration: 'asc',
      },
    });
  }

  async accepterMembre(projetId: number, userId: number) {
    const membre = await this.findOne(projetId, userId);

    if (membre.statut !== StatutMembre.EN_ATTENTE) {
      throw new ConflictException('Cette demande ne peut pas être acceptée');
    }

    const nombreMembresActifs = await this.prisma.membreProjet.count({
      where: {
        projetId,
        statut: StatutMembre.ACTIF,
      },
    });

    const projet = await this.prisma.projet.findUnique({
      where: {
        id: projetId,
      },
    });

    if (!projet) {
      throw new NotFoundException('Projet introuvable');
    }

    if (nombreMembresActifs >= projet.nombreMembresMax) {
      throw new ConflictException('Le nombre maximum de membres est atteint');
    }

    return this.prisma.membreProjet.update({
      where: {
        id: membre.id,
      },

      data: {
        statut: StatutMembre.ACTIF,
      },
    });
  }

  async refuserMembre(projetId: number, userId: number) {
    const membre = await this.findOne(projetId, userId);

    if (membre.statut !== StatutMembre.EN_ATTENTE) {
      throw new ConflictException('Cette demande n’est plus en attente');
    }

    return this.prisma.membreProjet.delete({
      where: {
        id: membre.id,
      },
    });
  }

  async designerChefProjet(projetId: number, userId: number) {
    const membre = await this.prisma.membreProjet.findUnique({
      where: {
        userId_projetId: {
          userId,
          projetId,
        },
      },
    });

    if (!membre) {
      throw new NotFoundException(
        'Cet utilisateur ne fait pas partie du projet',
      );
    }

    if (membre.statut !== StatutMembre.ACTIF) {
      throw new ConflictException(
        'Seul un membre actif peut être chef de projet',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Retirer le rôle de chef
      // à l'ancien chef éventuel
      await tx.membreProjet.updateMany({
        where: {
          projetId,
          role: RoleProjet.CHEF_PROJET,
        },

        data: {
          role: RoleProjet.MEMBRE,
        },
      });

      // 2. Désigner le nouveau chef
      return tx.membreProjet.update({
        where: {
          id: membre.id,
        },

        data: {
          role: RoleProjet.CHEF_PROJET,
        },

        include: {
          user: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true,
            },
          },
        },
      });
    });
  }
}
