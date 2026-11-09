/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';
import { AddProjetCompetenceDto } from './dto/add-projet-competence.dto';
import { UpdateProjetCompetenceDto } from './dto/update-projet-competence.dto';
import { RejoindreProjetDto } from './dto/rejoindre-projet.dto';
import { RoleProjet, StatutMembre } from 'src/generated/prisma/client';

@Injectable()
export class ProjetsService {
  constructor(private readonly prisma: PrismaService) {}

  // projet.service.ts
  async create(dto: CreateProjetDto, createdById: number) {
    if (dto.dateFin && new Date(dto.dateFin) < new Date(dto.dateDebut)) {
      throw new ConflictException(
        'La date de fin doit être après la date de début',
      );
    }

    return this.prisma.projet.create({
      data: {
        nom: dto.nom,
        description: dto.description,
        dateDebut: new Date(dto.dateDebut),
        dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
        nombreMembresMax: dto.nombreMembresMax,
        createdById,
      },
    });
  }
  async findAll() {
    return this.prisma.projet.findMany({
      orderBy: {
        createdAt: 'desc',
      },

      include: {
        _count: {
          select: {
            membres: true,
            taches: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const projet = await this.prisma.projet.findUnique({
      where: {
        id,
      },

      include: {
        membres: {
          include: {
            user: true,
          },
        },
        competences: {
        include: { competence: true }, // pour récupérer le nom de la compétence
      },
        _count: {
          select: {
            membres: true,
            taches: true,
          },
        },
      },
    });

    if (!projet) {
      throw new NotFoundException('Projet introuvable');
    }

    return projet;
  }

  async update(id: number, dto: UpdateProjetDto) {
    await this.findOne(id);

    return this.prisma.projet.update({
      where: {
        id,
      },

      data: {
        ...(dto.nom !== undefined && {
          nom: dto.nom,
        }),

        ...(dto.description !== undefined && {
          description: dto.description,
        }),

        ...(dto.dateDebut !== undefined && {
          dateDebut: new Date(dto.dateDebut),
        }),

        ...(dto.dateFin !== undefined && {
          dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
        }),

        ...(dto.nombreMembresMax !== undefined && {
          nombreMembresMax: dto.nombreMembresMax,
        }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.projet.delete({
      where: {
        id,
      },
    });
  }

  async addCompetence(projetId: number, dto: AddProjetCompetenceDto) {
    // 1. Vérifier que le projet existe
    const projet = await this.prisma.projet.findUnique({
      where: {
        id: projetId,
      },
    });

    if (!projet) {
      throw new NotFoundException('Projet introuvable');
    }

    // 2. Vérifier que la compétence existe
    const competence = await this.prisma.competence.findUnique({
      where: {
        id: dto.competenceId,
      },
    });

    if (!competence) {
      throw new NotFoundException('Compétence introuvable');
    }

    // 3. Vérifier si elle est déjà configurée
    const existante = await this.prisma.projetCompetence.findUnique({
      where: {
        projetId_competenceId: {
          projetId,
          competenceId: dto.competenceId,
        },
      },
    });

    if (existante) {
      throw new ConflictException(
        'Cette compétence est déjà configurée pour ce projet',
      );
    }

    return this.prisma.projetCompetence.create({
      data: {
        projetId,
        competenceId: dto.competenceId,
        nombreMax: dto.nombreMax,
      },

      include: {
        competence: true,
      },
    });
  }

  async getCompetences(projetId: number) {
    const projet = await this.prisma.projet.findUnique({
      where: {
        id: projetId,
      },
    });

    if (!projet) {
      throw new NotFoundException('Projet introuvable');
    }

    return this.prisma.projetCompetence.findMany({
      where: {
        projetId,
      },

      include: {
        competence: true,
      },

      orderBy: {
        competence: {
          nom: 'asc',
        },
      },
    });
  }

  async updateCompetence(
    projetId: number,
    competenceId: number,
    dto: UpdateProjetCompetenceDto,
  ) {
    const projetCompetence = await this.prisma.projetCompetence.findUnique({
      where: {
        projetId_competenceId: {
          projetId,
          competenceId,
        },
      },
    });

    if (!projetCompetence) {
      throw new NotFoundException(
        'Cette compétence n’est pas configurée pour ce projet',
      );
    }

    return this.prisma.projetCompetence.update({
      where: {
        id: projetCompetence.id,
      },

      data: {
        nombreMax: dto.nombreMax,
      },

      include: {
        competence: true,
      },
    });
  }

  async removeCompetence(projetId: number, competenceId: number) {
    const projetCompetence = await this.prisma.projetCompetence.findUnique({
      where: {
        projetId_competenceId: {
          projetId,
          competenceId,
        },
      },
    });

    if (!projetCompetence) {
      throw new NotFoundException(
        'Cette compétence n’est pas configurée pour ce projet',
      );
    }

    await this.prisma.projetCompetence.delete({
      where: {
        id: projetCompetence.id,
      },
    });

    return {
      message: 'Compétence retirée du projet',
    };
  }

  async rejoindreProjet(
    projetId: number,
    userId: number,
    dto: RejoindreProjetDto,
  ) {
    // 1. Vérifier que le projet existe
    const projet = await this.prisma.projet.findUnique({
      where: {
        id: projetId,
      },
    });

    if (!projet) {
      throw new NotFoundException('Projet introuvable');
    }

    // 2. Vérifier que l'utilisateur n'est pas déjà membre
    const membreExistant = await this.prisma.membreProjet.findUnique({
      where: {
        userId_projetId: {
          userId,
          projetId,
        },
      },
    });

    if (membreExistant) {
      throw new ConflictException(
        'Vous avez déjà rejoint ou demandé à rejoindre ce projet',
      );
    }

    // 3. Vérifier que l'utilisateur possède cette compétence
    const userCompetence = await this.prisma.userCompetence.findUnique({
      where: {
        userId_competenceId: {
          userId,
          competenceId: dto.competenceId,
        },
      },
    });

    if (!userCompetence) {
      throw new BadRequestException('Vous ne possédez pas cette compétence');
    }

    // 4. Vérifier que le projet recherche cette compétence
    const projetCompetence = await this.prisma.projetCompetence.findUnique({
      where: {
        projetId_competenceId: {
          projetId,
          competenceId: dto.competenceId,
        },
      },
    });

    if (!projetCompetence) {
      throw new BadRequestException(
        'Cette compétence n’est pas recherchée pour ce projet',
      );
    }

    // 5. Vérifier le nombre total de membres actifs ou en attente
    const nombreMembres = await this.prisma.membreProjet.count({
      where: {
        projetId,
        statut: {
          in: [StatutMembre.ACTIF],
        },
      },
    });

    if (nombreMembres >= projet.nombreMembresMax) {
      throw new BadRequestException(
        'Le projet a atteint son nombre maximum de membres',
      );
    }

    // 6. Vérifier le quota de cette compétence
    const nombreMembresCompetence = await this.prisma.membreProjet.count({
      where: {
        projetId,
        competenceId: dto.competenceId,
        statut: {
          in: [StatutMembre.ACTIF, StatutMembre.EN_ATTENTE],
        },
      },
    });

    if (nombreMembresCompetence >= projetCompetence.nombreMax) {
      throw new BadRequestException(
        'Le quota pour cette compétence est atteint',
      );
    }

    // 7. Créer la demande
    return this.prisma.membreProjet.create({
      data: {
        userId,
        projetId,
        competenceId: dto.competenceId,
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

        competence: true,

        projet: {
          select: {
            id: true,
            nom: true,
          },
        },
      },
    });
  }

  async getDemandes(projetId: number) {
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
          },
        },

        competence: true,
      },

      orderBy: {
        dateIntegration: 'asc',
      },
    });
  }

  async accepterMembre(projetId: number, membreId: number) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Récupérer la demande
      const membre = await tx.membreProjet.findFirst({
        where: {
          id: membreId,
          projetId,
        },

        include: {
          projet: true,
          competence: true,
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

      if (!membre) {
        throw new NotFoundException('Demande de membre introuvable');
      }

      // 2. Vérifier que la demande est encore en attente
      if (membre.statut !== StatutMembre.EN_ATTENTE) {
        throw new BadRequestException('Cette demande n’est plus en attente');
      }

      // 3. Vérifier le nombre total de membres ACTIFS
      const nombreMembresActifs = await tx.membreProjet.count({
        where: {
          projetId,
          statut: StatutMembre.ACTIF,
        },
      });

      if (nombreMembresActifs >= membre.projet.nombreMembresMax) {
        throw new BadRequestException(
          'Le nombre maximum de membres du projet est atteint',
        );
      }

      // 4. Vérifier que la compétence est toujours configurée
      if (!membre.competenceId) {
        throw new BadRequestException(
          'Aucune compétence n’est associée à cette demande',
        );
      }

      const projetCompetence = await tx.projetCompetence.findUnique({
        where: {
          projetId_competenceId: {
            projetId,
            competenceId: membre.competenceId,
          },
        },
      });

      if (!projetCompetence) {
        throw new BadRequestException(
          'Cette compétence n’est plus recherchée par le projet',
        );
      }

      // 5. Vérifier le quota de la compétence
      const nombreMembresCompetence = await tx.membreProjet.count({
        where: {
          projetId,
          competenceId: membre.competenceId,
          statut: StatutMembre.ACTIF,
        },
      });

      if (nombreMembresCompetence >= projetCompetence.nombreMax) {
        throw new BadRequestException(
          `Le quota pour la compétence "${membre.competence?.nom}" est atteint`,
        );
      }

      // 6. Accepter le membre
      return tx.membreProjet.update({
        where: {
          id: membreId,
        },

        data: {
          statut: StatutMembre.ACTIF,
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

          competence: true,

          projet: {
            select: {
              id: true,
              nom: true,
            },
          },
        },
      });
    });
  }

  async refuserMembre(projetId: number, membreId: number) {
    const membre = await this.prisma.membreProjet.findFirst({
      where: {
        id: membreId,
        projetId,
      },
    });

    if (!membre) {
      throw new NotFoundException('Demande de membre introuvable');
    }

    if (membre.statut !== StatutMembre.EN_ATTENTE) {
      throw new BadRequestException('Cette demande n’est plus en attente');
    }

    return this.prisma.membreProjet.update({
      where: {
        id: membreId,
      },

      data: {
        statut: StatutMembre.REFUSE,
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

        competence: true,
      },
    });
  }

  async getMembres(projetId: number) {
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
          },
        },

        competence: true,
      },

      orderBy: [
        {
          role: 'asc',
        },
        {
          dateIntegration: 'asc',
        },
      ],
    });
  }

  async getMembre(projetId: number, membreId: number) {
    const membre = await this.prisma.membreProjet.findFirst({
      where: {
        id: membreId,
        projetId,
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

        competence: true,

        projet: {
          select: {
            id: true,
            nom: true,
          },
        },
      },
    });

    if (!membre) {
      throw new NotFoundException('Membre introuvable dans ce projet');
    }

    return membre;
  }

  async designerChefProjet(projetId: number, membreId: number) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Vérifier que le membre existe
      const membre = await tx.membreProjet.findFirst({
        where: {
          id: membreId,
          projetId,
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

      if (!membre) {
        throw new NotFoundException('Membre introuvable dans ce projet');
      }

      // 2. Le membre doit être actif
      if (membre.statut !== StatutMembre.ACTIF) {
        throw new BadRequestException(
          'Seul un membre actif peut devenir chef de projet',
        );
      }

      // 3. Vérifier s'il existe déjà un chef
      const chefExistant = await tx.membreProjet.findFirst({
        where: {
          projetId,
          role: RoleProjet.CHEF_PROJET,
          statut: StatutMembre.ACTIF,
        },
      });

      if (chefExistant) {
        throw new ConflictException('Ce projet possède déjà un chef de projet');
      }

      // 4. Désigner le membre comme chef
      return tx.membreProjet.update({
        where: {
          id: membreId,
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

          competence: true,
        },
      });
    });
  }

  async changerChefProjet(projetId: number, nouveauChefId: number) {
    return this.prisma.$transaction(async (tx) => {
      // Vérifier le nouveau chef
      const nouveauChef = await tx.membreProjet.findFirst({
        where: {
          id: nouveauChefId,
          projetId,
        },
      });

      if (!nouveauChef) {
        throw new NotFoundException(
          'Le membre sélectionné n’existe pas dans ce projet',
        );
      }

      if (nouveauChef.statut !== StatutMembre.ACTIF) {
        throw new BadRequestException(
          'Le nouveau chef doit être un membre actif',
        );
      }

      // Chercher l'ancien chef
      const ancienChef = await tx.membreProjet.findFirst({
        where: {
          projetId,
          role: RoleProjet.CHEF_PROJET,
          statut: StatutMembre.ACTIF,
        },
      });

      // Retirer le rôle de l'ancien chef
      if (ancienChef && ancienChef.id !== nouveauChefId) {
        await tx.membreProjet.update({
          where: {
            id: ancienChef.id,
          },

          data: {
            role: RoleProjet.MEMBRE,
          },
        });
      }

      // Désigner le nouveau chef
      return tx.membreProjet.update({
        where: {
          id: nouveauChefId,
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

          competence: true,
        },
      });
    });
  }

  async retirerMembre(projetId: number, membreId: number) {
    const membre = await this.prisma.membreProjet.findFirst({
      where: {
        id: membreId,
        projetId,
      },
    });

    if (!membre) {
      throw new NotFoundException('Membre introuvable dans ce projet');
    }

    if (membre.statut !== StatutMembre.ACTIF) {
      throw new BadRequestException('Seul un membre actif peut être retiré');
    }

    if (membre.role === RoleProjet.CHEF_PROJET) {
      throw new BadRequestException(
        'Impossible de retirer le chef de projet. Désignez d’abord un nouveau chef.',
      );
    }

    return this.prisma.membreProjet.update({
      where: {
        id: membreId,
      },

      data: {
        statut: StatutMembre.QUITTE,
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

        competence: true,
      },
    });
  }
}
