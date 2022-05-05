import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class morseTextDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  text: string;
}
