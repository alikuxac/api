import { Module } from '@nestjs/common';

import { PermissionsModule } from './permissions/permissions.module';
import { SystemPreferencesModule } from './system_preferences/system_preferences.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [PermissionsModule, SystemPreferencesModule, RolesModule],
})
export class SystemsModule {}
