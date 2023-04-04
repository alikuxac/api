import { Module } from '@nestjs/common';
// import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './controller/app.controller';
import { AppService } from './services/app.service';

import { CommonModule } from 'src/common/common.module';
import { RoutersModule } from 'src/routers/routers.module';
import { BootstrapModule } from 'src/modules/system/bootstrap/bootstrap.module';
import { CoreModule } from 'src/modules/system/core/core.module';

@Module({
  imports: [CommonModule, BootstrapModule, RoutersModule, CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
