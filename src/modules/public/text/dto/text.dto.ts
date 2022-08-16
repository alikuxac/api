import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class TextDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  text: string;
}

export class base64TextDto extends TextDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  action: string;
}
