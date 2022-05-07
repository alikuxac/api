import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private mongo: MongooseHealthIndicator,
    private typeorm: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.http.pingCheck('main', 'https://alikuxac.xyz', { timeout: 1000 }),
    ]);
  }

  @Get('mongoose')
  @HealthCheck()
  checkMongoose() {
    return this.health.check([() => this.mongo.pingCheck('mongo')]);
  }

  @Get('typeorm')
  @HealthCheck()
  checkTypeorm() {
    return this.health.check([() => this.typeorm.pingCheck('typeorm')]);
  }

  @Get('memory')
  @HealthCheck()
  checkMemory() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
    ]);
  }
}
