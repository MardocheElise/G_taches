import { IsInt, Min } from 'class-validator';

export class RejoindreProjetDto {
  @IsInt()
  @Min(1)
  competenceId!: number;
}
