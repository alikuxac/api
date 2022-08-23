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
  CreateUserApiKey = 'createUserApiKey',
  DeleteUserApiKey = 'deleteUserApiKey',

  // Role
  ReadRole = 'readRole',
  CreateRole = 'createRole',
  UpdateRole = 'updateRole',
  DeleteRole = 'deleteRole',
}
