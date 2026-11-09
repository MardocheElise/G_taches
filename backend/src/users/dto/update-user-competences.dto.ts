import { ArrayNotEmpty, ArrayUnique, IsArray, IsInt } from 'class-validator';

export class UpdateUserCompetencesDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  competenceIds!: number[];
}
