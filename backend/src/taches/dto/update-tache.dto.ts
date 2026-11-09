import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PrioriteTache, StatutTache } from 'src/generated/prisma/client';

export class UpdateTacheDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  titre?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PrioriteTache)
  @IsOptional()
  priorite?: PrioriteTache;

  @IsEnum(StatutTache)
  @IsOptional()
  statut?: StatutTache;

  @IsDateString()
  @IsOptional()
  dateEcheance?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  assigneeId?: number;
}
