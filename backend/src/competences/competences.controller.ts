import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CompetencesService } from './competences.service';

import { CreateCompetenceDto } from './dto/create-competence.dto';
import { UpdateCompetenceDto } from './dto/update-competence.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleUtilisateur } from 'src/generated/prisma/client';

@Controller('competences')
@UseGuards(JwtAuthGuard)
export class CompetencesController {
  constructor(private readonly competencesService: CompetencesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  create(@Body() dto: CreateCompetenceDto) {
    return this.competencesService.create(dto);
  }

  @Get()
  findAll() {
    return this.competencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.competencesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompetenceDto,
  ) {
    return this.competencesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleUtilisateur.SUPER_ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.competencesService.remove(id);
  }
}
