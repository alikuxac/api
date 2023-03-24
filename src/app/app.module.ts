import { Module } from '@nestjs/common';

import { AppController } from './controller/app.controller';
import { AppService } from './services/app.service';

import { CommonModule } from 'src/common/common.module';
import { SharedModule } from 'src/shared/shared.module';
import { RoutersModule } from 'src/routers/routers.module';

@Module({
  imports: [SharedModule, CommonModule, RoutersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
