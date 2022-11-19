import { IsNumberString, IsOptional } from 'class-validator';

export class getAllStickRoleDto {
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  page?: number;
}
