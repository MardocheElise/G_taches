/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { TachesService } from './taches.service';

import { CreateTacheDto } from './dto/create-tache.dto';
import { UpdateTacheDto } from './dto/update-tache.dto';
import { CreateDependanceDto } from './dto/create-dependance.dto';
import { UpdateStatutTacheDto } from './dto/update-statut-tache.dto';

@Controller('projets/:projetId/taches')
@UseGuards(JwtAuthGuard)
export class TachesController {
  constructor(private readonly tachesService: TachesService) {}

  @Post()
  create(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Req() req,

    @Body()
    dto: CreateTacheDto,
  ) {
    return this.tachesService.create(projetId, req.user.id, dto);
  }

  @Get()
  findAll(
    @Param('projetId', ParseIntPipe)
    projetId: number,
  ) {
    return this.tachesService.findAllByProjet(projetId);
  }

  @Get(':tacheId')
  findOne(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('tacheId', ParseIntPipe)
    tacheId: number,
  ) {
    return this.tachesService.findOne(projetId, tacheId);
  }

  @Patch(':tacheId')
  update(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('tacheId', ParseIntPipe)
    tacheId: number,

    @Req() req,

    @Body()
    dto: UpdateTacheDto,
  ) {
    return this.tachesService.update(projetId, tacheId, req.user.id, dto);
  }

  @Delete(':tacheId')
  remove(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('tacheId', ParseIntPipe)
    tacheId: number,

    @Req() req,
  ) {
    return this.tachesService.remove(projetId, tacheId, req.user.id);
  }

  @Post(':tacheId/dependances')
  ajouterDependance(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('tacheId', ParseIntPipe)
    tacheId: number,

    @Req() req,

    @Body()
    dto: CreateDependanceDto,
  ) {
    return this.tachesService.ajouterDependance(
      projetId,
      tacheId,
      req.user.id,
      dto.dependanceId,
    );
  }

  @Get(':tacheId/dependances')
  getDependances(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('tacheId', ParseIntPipe)
    tacheId: number,
  ) {
    return this.tachesService.getDependances(projetId, tacheId);
  }

  @Delete(':tacheId/dependances/:dependanceId')
  supprimerDependance(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('tacheId', ParseIntPipe)
    tacheId: number,

    @Param('dependanceId', ParseIntPipe)
    dependanceId: number,

    @Req() req,
  ) {
    return this.tachesService.supprimerDependance(
      projetId,
      tacheId,
      dependanceId,
      req.user.id,
    );
  }

  @Patch(':tacheId/statut')
  changerStatut(
    @Param('projetId', ParseIntPipe)
    projetId: number,

    @Param('tacheId', ParseIntPipe)
    tacheId: number,

    @Body()
    dto: UpdateStatutTacheDto,

    @Req() req,
  ) {
    return this.tachesService.changerStatut(
      projetId,
      tacheId,
      req.user.id,
      dto.statut,
    );
  }
}
