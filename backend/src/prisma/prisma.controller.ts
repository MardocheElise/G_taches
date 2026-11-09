import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('prisma')
export class PrismaController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('test')
  async testerConnexion() {
    return this.prismaService.testerConnexion();
  }
}
