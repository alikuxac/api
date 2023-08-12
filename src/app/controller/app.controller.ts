import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { SkipAuth } from '@root/common/auth/decorators/auth.skip.decorator';
import { ThrottleredGuard } from '@root/common/request/decorators/request.decorator';
import { Response } from '@root/common/response/decorators/response.decorator';

@Controller()
@SkipAuth()
@ThrottleredGuard()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Response('common.uptime')
  getHello() {
    return {
      _metadata: {
        customProperty: {
          messageProperties: {
            count: Math.floor(process.uptime()),
          },
        },
      },
    };
  }

  @Get('status')
  getStatus() {
    return { data: { message: 'https://status.alikuxac.xyz' } };
  }
}
