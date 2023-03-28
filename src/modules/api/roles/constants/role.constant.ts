export enum RolePermission {
  // All
  Manage = 'manage',

  // User
  ReadUser = 'readUser',
  CreateUser = 'createUser',
  UpdateUser = 'updateUser',
  DeleteUser = 'deleteUser',
  ChangePassword = 'changePassword',
  ResetPassword = 'resetPassword',
  SetUserRole = 'setUserRole',
  ActiveUser = 'activeUser',
  DeactiveUser = 'deactiveUser',
  BanUser = 'banUser',
  UnbanUser = 'unbanUser',
  CreateUserApiKey = 'createUserApiKey',
  DeleteUserApiKey = 'deleteUserApiKey',

  // Role
  ReadRole = 'readRole',
  CreateRole = 'createRole',
  UpdateRole = 'updateRole',
  DeleteRole = 'deleteRole',
  EditPermissions = 'editPermissions',
  ChangePosition = 'changePostion',
}
