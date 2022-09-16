import { IsString } from 'class-validator';

export class createRoleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  position: number;

  @IsString()
  permissions: string[];
}

export class updateRoleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}

export class updatePositionDto {
  @IsString()
  position: number;
}
