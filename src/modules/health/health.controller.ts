import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private mongo: MongooseHealthIndicator,
    private typeorm: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.http.pingCheck('main', 'https://alikuxac.xyz', { timeout: 1000 }),
    ]);
  }

  // @Get('mongoose')
  // @HealthCheck()
  // checkMongoose() {
  //   return this.health.check([() => this.mongo.pingCheck('mongo')]);
  // }

  // @Get('typeorm')
  // @HealthCheck()
  // checkTypeorm() {
  //   return this.health.check([() => this.typeorm.pingCheck('typeorm')]);
  // }

  // Url checker
  @Get('danbot')
  @HealthCheck()
  checkDanbot() {
    return this.health.check([
      () =>
        this.http.pingCheck('danbot', 'https://panel.danbot.host', {
          timeout: 1000,
        }),
    ]);
  }

  // @Get('kuttit')
  // @HealthCheck()
  // checkKuttit() {
  //   return this.health.check([
  //     () =>
  //       this.http.pingCheck(
  //         'kuttit',
  //         this.configService.get<string>('KUTTIT_URL'),
  //         {
  //           timeout: 1000,
  //         },
  //       ),
  //   ]);
  // }
}
