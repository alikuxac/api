import { Controller } from '@nestjs/common';
import { SystemPreferencesService } from './system_preferences.service';

@Controller('system-preferences')
export class SystemPreferencesController {
  constructor(
    private readonly systemPreferencesService: SystemPreferencesService,
  ) {}
}
