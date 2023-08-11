import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { SkipAuth } from '@root/common/auth/decorators/auth.skip.decorator';
import { ThrottleredGuard } from '@root/common/request/decorators/request.decorator';

@Controller()
@SkipAuth()
@ThrottleredGuard()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    const uptime = this.appService.getUptime();
    return {
      data: {
        message: uptime,
      },
    };
  }

  @Get('status')
  getStatus() {
    return { data: { message: 'https://status.alikuxac.xyz' } };
  }
}
