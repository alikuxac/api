import { OmitType } from '@nestjs/swagger';
import { RoleCreateDto } from 'src/common/roles/dto/role.create.dto';

export class RoleUpdatePermissionDto extends OmitType(RoleCreateDto, [
  'name',
] as const) {}
