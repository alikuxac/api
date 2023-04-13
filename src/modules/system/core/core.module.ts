import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

// Module
import { RolesModule } from '@root/common/roles/roles.module';
import { UsersModule } from '@root/modules/api/users/users.module';
import { AuthModule } from '@root/common/auth/auth.module';

// Guard
import { JwtAuthAccessGuard } from '@root/common/auth/guards/jwt-access/jwt-access.guard';

// Interceptor
import { LoggingInterceptor } from '@root/modules/system/core/interceptors/logging.interceptor';
import { CurrentUserInterceptor } from '@root/modules/system/core/interceptors/put-user-to-request.interceptor';
import { TimeoutInterceptor } from '@root/modules/system/core/interceptors/timeout.interceptor';

// Pipe

// Filter
import { HttpExceptionFilter } from '@root/modules/system/core/filter/http-exception.filter';

/**
 * Import order: Guard -> Interceptor -> Filter -> Pipe
 */
@Module({
  imports: [AuthModule, UsersModule, RolesModule],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthAccessGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({ whitelist: true, transform: true }),
    },
  ],
})
export class CoreModule {}
