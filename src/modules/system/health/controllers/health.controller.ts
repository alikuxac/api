import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { AuthJwtAccessProtected } from '@root/common/auth/decorators/auth.jwt.decorator';
import { ThrottleredGuard } from '@root/common/request/decorators/request.decorator';

@ApiTags('Health')
@Controller('health')
@ThrottleredGuard()
@AuthJwtAccessProtected()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private mongo: MongooseHealthIndicator,
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

  @Get('memory')
  @HealthCheck()
  checkMemory() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
    ]);
  }
}
