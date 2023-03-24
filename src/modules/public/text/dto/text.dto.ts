import { IsNotEmpty, IsString, MaxLength, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TextDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The text to be converted',
    maxLength: 255,
    minLength: 1,
  })
  text: string;
}

export class base64TextDto extends TextDto {
  @IsString()
  @IsIn(['encode', 'decode'])
  @IsNotEmpty()
  @ApiProperty({
    description: 'The action to be performed',
    enum: ['encode', 'decode'],
  })
  action: string;
}
