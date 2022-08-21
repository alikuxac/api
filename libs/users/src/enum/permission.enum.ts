export enum UserRolePermission {
  // All
  ManageAll = 'manageAll',
  ReadAll = 'readAll',
  UpdateAll = 'updateAll',
  DeleteAll = 'deleteAll',

  // User
  ManageUser = 'manageUser',
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
  ManageRole = 'manageRole',
  ReadRole = 'readRole',
  ReadOtherRole = 'readOtherRole',
  CreateRole = 'createRole',
  UpdateRole = 'updateRole',
  DeleteRole = 'deleteRole',
}
