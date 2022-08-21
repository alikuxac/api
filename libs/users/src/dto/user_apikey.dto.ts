import { Type } from 'class-transformer';
import { IsIP, IsString, ValidateNested, MinLength } from 'class-validator';

export class IpDto {
  @IsIP()
  ip: string;
}

export class createUserApiKeyDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  description: string;

  @ValidateNested({ each: true })
  @Type(() => IpDto)
  ipWhitelist: IpDto[];
}

export class updateUserApiKeyDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}

export class deleteUserApiKeyDto {
  @IsString()
  name: string;
}
