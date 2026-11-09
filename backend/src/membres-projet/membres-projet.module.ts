import { Module } from '@nestjs/common';

import { MembresProjetController } from './membres-projet.controller';
import { MembresProjetService } from './membres-projet.service';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],

  controllers: [MembresProjetController],

  providers: [MembresProjetService],
})
export class MembresProjetModule {}
