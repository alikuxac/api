import { UserRolePermission } from '@users/enum';

export interface IUserRolePermission {
  action: UserRolePermission;
  allowed: boolean;
}
