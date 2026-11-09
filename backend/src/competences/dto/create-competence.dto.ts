import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCompetenceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nom!: string;
}
