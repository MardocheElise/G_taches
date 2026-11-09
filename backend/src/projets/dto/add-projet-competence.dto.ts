import { IsInt, Min } from 'class-validator';

export class AddProjetCompetenceDto {
  @IsInt()
  competenceId!: number;

  @IsInt()
  @Min(1)
  nombreMax!: number;
}
