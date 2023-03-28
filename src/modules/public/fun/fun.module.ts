import { Module } from '@nestjs/common';

import { FunService } from './services/fun.service';

@Module({
  controllers: [],
  providers: [FunService],
  exports: [FunService],
})
export class FunModule {}
