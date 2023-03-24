import { IsString, IsOptional, MinLength } from 'class-validator';

export class createUserApiKeyDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class deleteUserApiKeyDto {
  @IsString()
  name: string;
}
