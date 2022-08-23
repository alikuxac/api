import { Injectable } from '@nestjs/common';

import { UserRolePermission } from '@users/enum';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getUptime(): string {
    return `${Math.floor(process.uptime())} seconds`;
  }

  getRolePermission() {
    return Object.keys(UserRolePermission).map((key) => {
      return {
        key,
        value: UserRolePermission[key],
      };
    });
  }
}
