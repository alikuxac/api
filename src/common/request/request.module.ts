import {
  Global,
  HttpStatus,
  Module,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RequestMiddlewareModule } from './middlewares/request.middleware.module';

import { IsPasswordMediumConstraint } from './validations/request.is-password-medium.validation';
import { IsPasswordWeakConstraint } from './validations/request.is-password-weak.validation';
import { IsPasswordStrongConstraint } from './validations/request.is-password-strong.validation';
import { IsOnlyDigitsConstraint } from './validations/request.only-digits.validation';
import { SafeStringConstraint } from './validations/request.safe-string.validation';
import { IsStartWithConstraint } from './validations/request.is-start-with.validation';
import { MinGreaterThanConstraint } from './validations/request.min-greater-than.validation';
import { MinGreaterThanEqualConstraint } from './validations/request.min-greater-than-equal.validation';
import { MaxGreaterThanConstraint } from './validations/request.max-greater-than.validation';
import { MaxGreaterThanEqualConstraint } from './validations/request.max-greater-than-equal.validation';
import { ENUM_REQUEST_STATUS_CODE_ERROR } from './constants/request.status-code.constant';

import { ThrottlerModule } from '@nestjs/throttler';

@Global()
@Module({
  imports: [
    RequestMiddlewareModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get('request.throttle.ttl'),
        limit: configService.get('request.throttle.limit'),
      }),
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          whitelist: true,
          skipNullProperties: false,
          skipUndefinedProperties: false,
          skipMissingProperties: false,
          forbidUnknownValues: false,
          transformOptions: { enableImplicitConversion: true },
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          exceptionFactory: async (errors: ValidationError[]) =>
            new UnprocessableEntityException({
              statusCode:
                ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR,
              message: 'request.validation',
              errors,
            }),
        }),
    },
    IsPasswordMediumConstraint,
    IsPasswordWeakConstraint,
    IsPasswordStrongConstraint,
    IsOnlyDigitsConstraint,
    SafeStringConstraint,
    IsStartWithConstraint,
    MinGreaterThanConstraint,
    MinGreaterThanEqualConstraint,
    MaxGreaterThanConstraint,
    MaxGreaterThanEqualConstraint,
  ],
})
export class RequestModule {}
