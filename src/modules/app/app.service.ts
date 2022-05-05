import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getUptime(): string {
    return `${Math.floor(process.uptime())} seconds`;
  }
}
