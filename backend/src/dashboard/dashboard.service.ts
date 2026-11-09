import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { StatutProjet } from 'src/generated/prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [
      totalProjets,
      projetsPlanifies,
      projetsEnCours,
      projetsTermines,
      projetsArchives,
      totalUtilisateurs,
      derniersProjets,
      projetsParStatut,
    ] = await Promise.all([
      this.prisma.projet.count(),

      this.prisma.projet.count({
        where: {
          statut: StatutProjet.PLANIFIE,
        },
      }),

      this.prisma.projet.count({
        where: {
          statut: StatutProjet.EN_COURS,
        },
      }),

      this.prisma.projet.count({
        where: {
          statut: StatutProjet.TERMINE,
        },
      }),

      this.prisma.projet.count({
        where: {
          statut: StatutProjet.ARCHIVE,
        },
      }),

      this.prisma.user.count(),

      this.prisma.projet.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
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
          _count: {
            select: {
              membres: true,
              taches: true,
            },
          },
        },
      }),

      this.prisma.projet.groupBy({
        by: ['statut'],
        _count: {
          statut: true,
        },
      }),
    ]);

    return {
      statistiques: {
        totalProjets,
        projetsPlanifies,
        projetsEnCours,
        projetsTermines,
        projetsArchives,
        totalUtilisateurs,
      },

      projetsParStatut: projetsParStatut.map((item) => ({
        statut: item.statut,
        nombre: item._count.statut,
      })),

      derniersProjets,
    };
  }
}
