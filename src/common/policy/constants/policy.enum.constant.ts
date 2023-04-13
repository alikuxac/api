export enum RolePermission {
  // All
  Manage = 'manage',

  // Default
  Read = 'read',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',

  // Customize
  Ban = 'ban',
  Unban = 'unban',
}

export enum RolePermissionGroup {
  USER = 'USER',
  ROLE = 'ROLE',
}
