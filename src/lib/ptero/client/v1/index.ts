export * from './interface';
export * from './rest';

export const APIVersions = '1';
export const SpecificServerRoute = (serverID: string) =>
  `/api/client/servers/${serverID}`;
export type FileManagerAction =
  | 'list'
  | 'content'
  | 'download'
  | 'rename'
  | 'copy'
  | 'write'
  | 'compress'
  | 'decompress'
  | 'upload'
  | 'delete'
  | 'create-folder';
export const ClientRoutes = {
  /**
   * Get all servers (Client)
   * GET - /api/client
   */
  listServers() {
    return '/api/client' as const;
  },

  /**
   * Check permissions (Client)
   * GET - /api/client/permissions
   */
  permissions() {
    return '/api/client/permissions' as const;
  },

  /**
   * Get account information (Client)
   * GET - /api/client/account
   */
  accountDetails() {
    return '/api/client/account' as const;
  },

  /**
   * Two factor authentication (Client)
   * GET - /api/client/account/two-factor
   * POST - /api/client/account/two-factor
   * DELETE - /api/client/account/two-factor
   */
  twoFactor() {
    return '/api/client/account/two-factor' as const;
  },

  /**
   * Update email (Client)
   * PUT - /api/client/account/email
   */
  email() {
    return '/api/client/account/email' as const;
  },

  /**
   * Update password (Client)
   * PUT - /api/client/account/password
   */
  password() {
    return '/api/client/account/password' as const;
  },

  /**
   * Api keys (Client)
   * GET - /api/client/account/api-keys
   * POST - /api/client/account/api-keys
   * DELETE - /api/client/account/api-keys/:identifier
   */
  apiKeys(identifier?: string) {
    const parts = ['/api/client', 'account', 'api-keys'];

    if (identifier) parts.push(identifier);

    return parts.join('/') as
      | '/api/client/account/api-keys'
      | `/api/client/account/api-keys/${string}`;
  },

  /**
   * Specific server details (Client)
   * GET - /api/client/servers/:serverID
   */
  serverDetails(serverID: string) {
    return `${SpecificServerRoute(serverID)}` as const;
  },

  /**
   * Get server websocket connection (Client)
   * GET - /api/client/servers/:serverID/websocket
   */
  serverWebsocket(serverID: string) {
    return `${SpecificServerRoute(serverID)}/websocket` as const;
  },

  /**
   * Get server resource (Client)
   * GET - /api/client/servers/:serverID/resource
   */
  serverResource(serverID: string) {
    return `${SpecificServerRoute(serverID)}/resources` as const;
  },

  /**
   * Send command to server (Client)
   * POST - /api/client/servers/:serverID/command
   */
  serverCommand(serverID: string) {
    return `${SpecificServerRoute(serverID)}/command` as const;
  },

  /**
   * Server databases (Client)
   * GET - /api/client/servers/:serverID/databases
   * POST - /api/client/servers/:serverID/databases
   * POST - /api/client/servers/:serverID/databases/:databaseID/rotate-password
   * DELETE - /api/client/servers/:serverID/databases/:databaseID
   */
  serverDatabases(
    serverID: string,
    databaseID?: string,
    rotatePassword?: boolean,
  ) {
    const parts = ['/api/client', 'servers', serverID, 'databases'];

    if (databaseID) parts.push(databaseID);
    if (rotatePassword) parts.push('rotate-password');

    return parts.join('/') as
      | `/api/client/servers/${string}/databases`
      | `/api/client/servers/${string}/databases/${string}`
      | `/api/client/servers/${string}/databases/${string}/rotate-password`;
  },

  /**
   * File manager (Client)
   * GET - /api/client/servers/:serverID/files/list
   * GET - /api/client/servers/:serverID/files/content
   * GET - /api/client/servers/:serverID/files/download
   * PUT - /api/client/servers/:serverID/files/rename
   * POST - /api/client/servers/:serverID/files/copy
   * POST - /api/client/servers/:serverID/files/write
   * POST - /api/client/servers/:serverID/files/compress
   * POST - /api/client/servers/:serverID/files/decompress
   * POST - /api/client/servers/:serverID/files/delete
   * POST - /api/client/servers/:serverID/files/create-folder
   * GET - /api/client/servers/:serverID/files/upload
   */
  serverFileManager(serverID: string, action: FileManagerAction) {
    switch (action) {
      case 'list':
        return `${SpecificServerRoute(serverID)}/files/list` as const;
      case 'content':
        return `${SpecificServerRoute(serverID)}/files/content` as const;
      case 'download':
        return `${SpecificServerRoute(serverID)}/files/download` as const;
      case 'rename':
        return `${SpecificServerRoute(serverID)}/files/rename` as const;
      case 'copy':
        return `${SpecificServerRoute(serverID)}/files/copy` as const;
      case 'write':
        return `${SpecificServerRoute(serverID)}/files/write` as const;
      case 'compress':
        return `${SpecificServerRoute(serverID)}/files/compress` as const;
      case 'decompress':
        return `${SpecificServerRoute(serverID)}/files/decompress` as const;
      case 'delete':
        return `${SpecificServerRoute(serverID)}/files/delete` as const;
      case 'create-folder':
        return `${SpecificServerRoute(serverID)}/files/create-folder` as const;
      case 'upload':
        return `${SpecificServerRoute(serverID)}/files/upload` as const;
    }
  },

  /**
   * Server Schedules (Client)
   * GET - /api/client/servers/:serverID/schedules
   * POST - /api/client/servers/:serverID/schedules
   * GET - /api/client/servers/:serverID/schedules/:scheduleID
   * POST - /api/client/servers/:serverID/schedules/:scheduleID
   * DELETE - /api/client/servers/:serverID/schedules/:scheduleID
   */
  serverSchedules(serverID: string, scheduleID?: string) {
    const parts = ['/api/client', 'servers', serverID, 'schedules'];

    if (scheduleID) parts.push(scheduleID);

    return parts.join('/') as
      | `/api/client/servers/${string}/schedules`
      | `/api/client/servers/${string}/schedules/${string}`;
  },

  /**
   * Server Schedules Task (Client)
   * GET - /api/client/servers/:serverID/schedules/:scheduleID/tasks
   * POST - /api/client/servers/:serverID/schedules/:scheduleID/tasks/:taskID
   * DELETE - /api/client/servers/:serverID/schedules/:scheduleID/tasks/:taskID
   */
  serverScheduleTask(serverID: string, scheduleID: string, taskID?: string) {
    const parts = [
      '/api/client',
      'servers',
      serverID,
      'schedules',
      scheduleID,
      'tasks',
    ];

    if (taskID) parts.push(taskID);

    return parts.join('/') as
      | `/api/client/servers/${string}/schedules/${string}/tasks`
      | `/api/client/servers/${string}/schedules/${string}/tasks/${string}`;
  },

  /**
   * Server Network (allocations) (Client)
   * GET - /api/client/servers/:serverID/network/allocations
   * POST - /api/client/servers/:serverID/network/allocations
   * POST - /api/client/servers/:serverID/network/allocations/:allocationID
   * POST - /api/client/servers/:serverID/network/allocations/:allocationID/primary
   * DELETE - /api/client/servers/:serverID/network/allocations/:allocationID
   */
  serverNetworkAllocations(
    serverID: string,
    allocationID?: string,
    primary?: boolean,
  ) {
    const parts = [
      '/api/client',
      'servers',
      serverID,
      'network',
      'allocations',
    ];

    if (allocationID) parts.push(allocationID);
    if (primary) parts.push('primary');

    return parts.join('/') as
      | `/api/client/servers/${string}/network/allocations`
      | `/api/client/servers/${string}/network/allocations/${string}`
      | `/api/client/servers/${string}/network/allocations/${string}/primary`;
  },

  /**
   * Server Subuser (Client)
   * GET - /api/client/servers/:serverID/users
   * POST - /api/client/servers/:serverID/users
   * GET - /api/client/servers/:serverID/users/:userID
   * POST - /api/client/servers/:serverID/users/:userID
   * DELETE - /api/client/servers/:serverID/users/:userID
   */
  serverSubUser(serverID: string, userID?: string) {
    const parts = ['/api/client', 'servers', serverID, 'users'];

    if (userID) parts.push(userID);

    return parts.join('/') as
      | `/api/client/servers/${string}/users`
      | `/api/client/servers/${string}/users/${string}`;
  },

  /**
   * Server Backups (Client)
   * GET - /api/client/servers/:serverID/backups
   * POST - /api/client/servers/:serverID/backups
   * GET - /api/client/servers/:serverID/backups/:backupID
   * GET - /api/client/servers/:serverID/backups/:backupID/download
   * DELETE - /api/client/servers/:serverID/backups/:backupID
   */
  serverBackups(serverID: string, backupID?: string, download?: boolean) {
    const parts = ['/api/client', 'servers', serverID, 'backups'];

    if (backupID) parts.push(backupID);
    if (download) parts.push('download');

    return parts.join('/') as
      | `/api/client/servers/${string}/backups`
      | `/api/client/servers/${string}/backups/${string}`
      | `/api/client/servers/${string}/backups/${string}/download`;
  },

  /**
   * Server Variable (Client)
   * GET - /api/client/servers/:serverID/startup
   * PUT - /api/client/servers/:serverID/startup/variable
   */
  serverVariable(serverID: string, variable?: boolean) {
    const parts = ['/api/client', 'servers', serverID, 'startup'];

    if (variable) parts.push('variable');

    return parts.join('/') as
      | `/api/client/servers/${string}/startup`
      | `/api/client/servers/${string}/startup/variable`;
  },

  /**
   * Server Settings (Client)
   * POST = /api/client/servers/:serverID/settings/rename
   * POST = /api/client/servers/:serverID/settings/reinstall
   */
  serverSettings(serverID: string, settings: 'rename' | 'reinstall') {
    return `${SpecificServerRoute(serverID)}/settings/${settings}` as const;
  },
};
