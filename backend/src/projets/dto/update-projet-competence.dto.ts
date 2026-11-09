import { IsInt, Min } from 'class-validator';

export class UpdateProjetCompetenceDto {
  @IsInt()
  @Min(1)
  nombreMax!: number;
}
