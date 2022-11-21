import {
  IsString,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class serverDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The host to ping', type: String })
  host: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'The port to ping', type: Number })
  port: number;
}

export class javaDto extends serverDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Legacy mode', type: Boolean })
  legacy: boolean;
}

export class queryDto extends serverDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Whether to return the full response',
    type: Boolean,
  })
  full: boolean;
}

export class parseAddressDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The address to parse', type: String })
  address: string;
}
