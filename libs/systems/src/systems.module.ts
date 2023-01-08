import { Module } from '@nestjs/common';

import { SystemPreferencesModule } from './system_preferences/system_preferences.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [SystemPreferencesModule, RolesModule],
})
export class SystemsModule {}
