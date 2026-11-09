// create-projet.dto.ts
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProjetDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nom!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  dateDebut!: string;

  @IsDateString()
  @IsOptional()
  dateFin?: string;

  @IsInt()
  @Min(1)
  nombreMembresMax!: number;
}
