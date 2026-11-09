import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateCompetenceDto } from './dto/create-competence.dto';
import { UpdateCompetenceDto } from './dto/update-competence.dto';

@Injectable()
export class CompetencesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCompetenceDto) {
    const existe = await this.prisma.competence.findUnique({
      where: {
        nom: dto.nom,
      },
    });

    if (existe) {
      throw new ConflictException('Cette compétence existe déjà');
    }

    return this.prisma.competence.create({
      data: {
        nom: dto.nom,
      },
    });
  }

  async findAll() {
    return this.prisma.competence.findMany({
      orderBy: {
        nom: 'asc',
      },

      include: {
        _count: {
          select: {
            utilisateurs: true,
            projets: true,
            membreProjets: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const competence = await this.prisma.competence.findUnique({
      where: {
        id,
      },
    });

    if (!competence) {
      throw new NotFoundException('Compétence introuvable');
    }

    return competence;
  }

  async update(id: number, dto: UpdateCompetenceDto) {
    await this.findOne(id);

    return this.prisma.competence.update({
      where: {
        id,
      },

      data: {
        ...(dto.nom !== undefined && {
          nom: dto.nom,
        }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.competence.delete({
      where: {
        id,
      },
    });
  }
}
