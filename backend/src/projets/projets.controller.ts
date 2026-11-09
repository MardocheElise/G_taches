/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
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

import { ProjetsService } from './projets.service';

import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleUtilisateur } from 'src/generated/prisma/client';
import { AddProjetCompetenceDto } from './dto/add-projet-competence.dto';
import { UpdateProjetCompetenceDto } from './dto/update-projet-competence.dto';
import { RejoindreProjetDto } from './dto/rejoindre-projet.dto';
import { ChangerChefProjetDto } from './dto/changer-chef-projet.dto';

@Controller('projets')
export class ProjetsController {
  constructor(private readonly projetsService: ProjetsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  // @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateProjetDto, @Req() req: any) {
    return this.projetsService.create(dto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.projetsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projetsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjetDto) {
    return this.projetsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projetsService.remove(id);
  }

  @Post(':projetId/competences')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  addCompetence(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Body()
    dto: AddProjetCompetenceDto,
  ) {
    return this.projetsService.addCompetence(projetId, dto);
  }

  @Patch(':projetId/competences/:competenceId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  updateCompetence(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('competenceId', ParseIntPipe)
    competenceId: number,

    @Body()
    dto: UpdateProjetCompetenceDto,
  ) {
    return this.projetsService.updateCompetence(projetId, competenceId, dto);
  }

  @Delete(':projetId/competences/:competenceId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  removeCompetence(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('competenceId', ParseIntPipe)
    competenceId: number,
  ) {
    return this.projetsService.removeCompetence(projetId, competenceId);
  }

  @Get(':projetId/competences')
  @UseGuards(JwtAuthGuard)
  getCompetences(
    @Param('projetId', ParseIntPipe)
    projetId: number,
  ) {
    return this.projetsService.getCompetences(projetId);
  }

  @Post(':projetId/rejoindre')
  @UseGuards(JwtAuthGuard)
  rejoindreProjet(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Req()
    req,

    @Body()
    dto: RejoindreProjetDto,
  ) {
    return this.projetsService.rejoindreProjet(projetId, req.user.id, dto);
  }

  @Get(':projetId/demandes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  getDemandes(
    @Param('projetId', ParseIntPipe)
    projetId: number,
  ) {
    return this.projetsService.getDemandes(projetId);
  }

  @Patch(':projetId/membres/:membreId/accepter')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  accepterMembre(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('membreId', ParseIntPipe)
    membreId: number,
  ) {
    return this.projetsService.accepterMembre(projetId, membreId);
  }

  @Patch(':projetId/membres/:membreId/refuser')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  refuserMembre(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('membreId', ParseIntPipe)
    membreId: number,
  ) {
    return this.projetsService.refuserMembre(projetId, membreId);
  }

  @Get(':projetId/membres')
  @UseGuards(JwtAuthGuard)
  getMembres(
    @Param('projetId', ParseIntPipe)
    projetId: number,
  ) {
    return this.projetsService.getMembres(projetId);
  }

  @Get(':projetId/membres/:membreId')
  @UseGuards(JwtAuthGuard)
  getMembre(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('membreId', ParseIntPipe)
    membreId: number,
  ) {
    return this.projetsService.getMembre(projetId, membreId);
  }

  @Patch(':projetId/chef/:membreId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  designerChefProjet(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('membreId', ParseIntPipe)
    membreId: number,
  ) {
    return this.projetsService.designerChefProjet(projetId, membreId);
  }

  @Patch(':projetId/chef')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  changerChefProjet(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Body()
    dto: ChangerChefProjetDto,
  ) {
    return this.projetsService.changerChefProjet(projetId, dto.membreId);
  }

  @Delete(':projetId/membres/:membreId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  retirerMembre(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('membreId', ParseIntPipe)
    membreId: number,
  ) {
    return this.projetsService.retirerMembre(projetId, membreId);
  }
}
