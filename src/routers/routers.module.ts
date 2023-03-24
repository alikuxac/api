import { Module } from '@nestjs/common';
import { RouterModule as NestjsRouterModule } from '@nestjs/core';

import { RouterModule } from './router/router.module';
import { RouterAdminModule } from './router/router.admin.module';

@Module({
  imports: [
    RouterAdminModule,
    RouterModule,
    NestjsRouterModule.register([
      { path: '/', module: RouterModule },
      { path: '/admin', module: RouterAdminModule },
    ]),
  ],
})
export class RoutersModule {}
