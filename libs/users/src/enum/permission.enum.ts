export enum UserRolePermission {
  // All
  Manage = 'manage',

  // User
  ReadUser = 'readUser',
  ReadOtherUser = 'readOtherUser',
  CreateUser = 'createUser',
  UpdateUser = 'updateUser',
  UpdateOtherUser = 'updateOtherUser',
  DeleteUser = 'deleteUser',
  ChangePassword = 'changePassword',
  ResetPassword = 'resetPassword',
  SetUserRole = 'setUserRole',

  // Role
  ReadRole = 'readRole',
  ReadOtherRole = 'readOtherRole',
  CreateRole = 'createRole',
  UpdateRole = 'updateRole',
  DeleteRole = 'deleteRole',
}
