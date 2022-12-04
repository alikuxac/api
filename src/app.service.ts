import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { UserRolePermission } from '@users/enum';

@Injectable()
export class AppService {
  constructor(private readonly i18nService: I18nService) {}
  getHello(): string {
    return this.i18nService.t('common.hello_word');
  }

  getUptime(): string {
    return this.i18nService.t('common.uptime', {
      args: { count: Math.floor(process.uptime()) },
    });
    // return `${Math.floor(process.uptime())} seconds`;
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
