import { Module } from '@nestjs/common';
import { SystemPreferencesService } from './system_preferences.service';
import { SystemPreferencesController } from './system_preferences.controller';

@Module({
  controllers: [SystemPreferencesController],
  providers: [SystemPreferencesService],
})
export class SystemPreferencesModule {}
