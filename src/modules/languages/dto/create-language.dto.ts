import { IsString, IsISO31661Alpha2, IsNotEmpty } from 'class-validator';

export class CreateLanguageDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsISO31661Alpha2()
  @IsNotEmpty()
  lang: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
