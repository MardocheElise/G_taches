/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserCompetencesDto } from './dto/update-user-competences.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Req() req: any) {
    return req.user;
  }

  @Get('me/competences')
  getMyCompetences(@Req() req) {
    return this.usersService.getMyCompetences(req.user.id);
  }

  @Post('me/competences')
  addMyCompetences(@Req() req, @Body() dto: UpdateUserCompetencesDto) {
    return this.usersService.addMyCompetences(req.user.id, dto);
  }

  @Delete('me/competences/:competenceId')
  removeMyCompetence(
    @Req() req,

    @Param('competenceId', ParseIntPipe)
    competenceId: number,
  ) {
    return this.usersService.removeMyCompetence(req.user.id, competenceId);
  }
}
