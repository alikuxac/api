import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('https://alikuxac.xyz', 301)
  getHello() {
    return;
  }

  @Get('uptime')
  getUptime(): string {
    return this.appService.getUptime();
  }

  @Get('status')
  @Redirect('https://status.alikuxac.xyz', 301)
  getStatus() {
    return;
  }
}
