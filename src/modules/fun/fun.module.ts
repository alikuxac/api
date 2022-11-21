import { Module } from '@nestjs/common';
import { FunService } from './fun.service';
import { FunController } from './fun.controller';

@Module({
  controllers: [FunController],
  providers: [FunService],
})
export class FunModule {}
