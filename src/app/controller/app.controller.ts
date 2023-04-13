import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    const uptime = this.appService.getUptime();
    return {
      success: true,
      message: uptime,
    };
  }

  @Get('status')
  getStatus() {
    return { success: true, message: 'https://status.alikuxac.xyz' };
  }
}
