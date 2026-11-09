import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PrioriteTache } from 'src/generated/prisma/client';

export class CreateTacheDto {
  @IsString()
  @IsNotEmpty()
  titre!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PrioriteTache)
  @IsOptional()
  priorite?: PrioriteTache;

  @IsDateString()
  @IsOptional()
  dateDebut?: string;

  @IsDateString()
  @IsOptional()
  dateEcheance?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  assigneeId?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  parentId?: number;
}
