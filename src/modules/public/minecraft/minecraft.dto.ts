import {
  IsString,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class serverDto {
  @IsString()
  @IsNotEmpty()
  host: string;

  @IsNumber()
  @IsOptional()
  port: number;
}

export class javaDto extends serverDto {
  @IsBoolean()
  @IsOptional()
  legacy: boolean;
}

export class queryDto extends serverDto {
  @IsBoolean()
  @IsOptional()
  full: boolean;
}

export class parseAddressDto {
  @IsString()
  @IsNotEmpty()
  address: string;
}
