import { IsEnum } from 'class-validator';
import { StatutTache } from 'src/generated/prisma/client';

export class UpdateStatutTacheDto {
  @IsEnum(StatutTache)
  statut!: StatutTache;
}
