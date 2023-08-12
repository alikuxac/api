import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { RequestCompressionMiddleware } from './compression/request.compression.middleware';
import { RequestHelmetMiddleware } from './helmet/request.helmet.middleware';
import { RequestIdMiddleware } from './id/request.id.middleware';
import { RequestCorsMiddleware } from './cors/request.cors.middleware';
import { RequestUserAgentMiddleware } from './user-agents/request.user-agents.middleware';
import { RequestTimestampMiddleware } from './timestamps/request.timestamps.middleware';
import { RequestTimezoneMiddleware } from './timezone/request.timezone.middleware';

@Module({})
export class RequestMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        RequestIdMiddleware,
        RequestCorsMiddleware,
        RequestUserAgentMiddleware,
        RequestHelmetMiddleware,
        RequestCompressionMiddleware,
        RequestTimestampMiddleware,
        RequestTimezoneMiddleware,
      )
      .forRoutes('*');
  }
}
