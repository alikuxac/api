import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

import { ErrorFilter } from './filters/error.filter';
import { ErrorGuard } from './guards/error.guard';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ErrorGuard,
    },
  ],
})
export class ErrorModule {}
