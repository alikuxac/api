export enum RolePermission {
  // All
  MANAGE = 'manage',

  // Default
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum RoleRequestPermission {
  MANAGE,
  READ,
  CREATE,
  UPDATE,
  DELETE,
}

export enum RolePermissionGroup {
  USER = 'USER',
  ROLE = 'ROLE',
}
