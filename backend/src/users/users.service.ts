/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserCompetencesDto } from './dto/update-user-competences.dto';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from '../auth/dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Cette adresse email est déjà utilisée');
    }

    const hashedPassword = await bcrypt.hash(registerDto.motDePasse, 10);

    const user = await this.prisma.user.create({
      data: {
        nom: registerDto.nom,
        prenom: registerDto.prenom,
        email: registerDto.email,
        motDePasse: hashedPassword,
      },
    });

    const { motDePasse, ...result } = user;

    return result;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getMyCompetences(userId: number) {
    return this.prisma.userCompetence.findMany({
      where: {
        userId,
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

  async addMyCompetences(userId: number, dto: UpdateUserCompetencesDto) {
    // Vérifier que toutes les compétences existent
    const competences = await this.prisma.competence.findMany({
      where: {
        id: {
          in: dto.competenceIds,
        },
      },
    });

    if (competences.length !== dto.competenceIds.length) {
      throw new NotFoundException(
        'Une ou plusieurs compétences sont introuvables',
      );
    }

    // Vérifier les compétences déjà associées
    const existantes = await this.prisma.userCompetence.findMany({
      where: {
        userId,

        competenceId: {
          in: dto.competenceIds,
        },
      },
    });

    if (existantes.length > 0) {
      throw new ConflictException(
        'Une ou plusieurs compétences sont déjà associées à votre profil',
      );
    }

    // Création des associations
    await this.prisma.userCompetence.createMany({
      data: dto.competenceIds.map((competenceId) => ({
        userId,
        competenceId,
      })),
    });

    return this.getMyCompetences(userId);
  }

  async removeMyCompetence(userId: number, competenceId: number) {
    const userCompetence = await this.prisma.userCompetence.findUnique({
      where: {
        userId_competenceId: {
          userId,
          competenceId,
        },
      },
    });

    if (!userCompetence) {
      throw new NotFoundException(
        'Cette compétence ne fait pas partie de votre profil',
      );
    }

    await this.prisma.userCompetence.delete({
      where: {
        userId_competenceId: {
          userId,
          competenceId,
        },
      },
    });

    return {
      message: 'Compétence supprimée de votre profil',
    };
  }
}
