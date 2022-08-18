import { IsNotEmpty, IsString, MaxLength, IsIn } from 'class-validator';

export class TextDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  text: string;
}

export class base64TextDto extends TextDto {
  @IsString()
  @IsIn(['encode', 'decode'])
  @IsNotEmpty()
  action: string;
}
