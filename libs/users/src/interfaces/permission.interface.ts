import { UserRolePermission } from '@users/enum';

export interface UserRolePermissions {
  action: UserRolePermission;
  allowed: boolean;
  restricted: boolean;
}
