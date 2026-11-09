/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { MembresProjetService } from './membres-projet.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectAccessGuard } from '../auth/guards/project-access.guard';
import { RoleUtilisateur } from 'src/generated/prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('projets')
@UseGuards(JwtAuthGuard)
export class MembresProjetController {
  constructor(private readonly membresProjetService: MembresProjetService) {}

  /**
   * Rejoindre un projet
   */
  @Post(':projetId/rejoindre')
  rejoindreProjet(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Req() req,
  ) {
    return this.membresProjetService.rejoindreProjet(req.user.id, projetId);
  }

  /**
   * Voir les membres d'un projet
   */
  @Get(':projetId/membres')
  @UseGuards(ProjectAccessGuard)
  findByProjet(
    @Param('projetId', ParseIntPipe)
    projetId: number,
  ) {
    return this.membresProjetService.findByProjet(projetId);
  }

  /**
   * Voir un membre précis
   */
  @Get(':projetId/membres/:userId')
  @UseGuards(ProjectAccessGuard)
  findOne(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('userId', ParseIntPipe)
    userId: number,
  ) {
    return this.membresProjetService.findOne(projetId, userId);
  }

  /**
   * Quitter un projet
   */
  @Delete(':projetId/quitter')
  quitterProjet(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Req() req,
  ) {
    return this.membresProjetService.quitterProjet(req.user.id, projetId);
  }

  @Get(':projetId/demandes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  findDemandes(
    @Param('projetId', ParseIntPipe)
    projetId: number,
  ) {
    return this.membresProjetService.findDemandes(projetId);
  }

  @Patch(':projetId/membres/:userId/accepter')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  accepterMembre(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('userId', ParseIntPipe)
    userId: number,
  ) {
    return this.membresProjetService.accepterMembre(projetId, userId);
  }

  //refuer membre
  @Delete(':projetId/membres/:userId/refuser')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  refuserMembre(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('userId', ParseIntPipe)
    userId: number,
  ) {
    return this.membresProjetService.refuserMembre(projetId, userId);
  }

  //designation chef de projet
  @Patch(':projetId/membres/:userId/chef')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  designerChefProjet(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('userId', ParseIntPipe)
    userId: number,
  ) {
    return this.membresProjetService.designerChefProjet(projetId, userId);
  }
}
