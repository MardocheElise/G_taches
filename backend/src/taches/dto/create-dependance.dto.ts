import { IsInt, Min } from 'class-validator';

export class CreateDependanceDto {
  @IsInt()
  @Min(1)
  dependanceId!: number;
}
