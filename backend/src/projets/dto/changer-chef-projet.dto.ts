import { IsInt, Min } from 'class-validator';

export class ChangerChefProjetDto {
  @IsInt()
  @Min(1)
  membreId!: number;
}
