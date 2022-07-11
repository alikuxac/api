import { Module } from '@nestjs/common';
import { PteroService } from './ptero.service';

@Module({
  providers: [PteroService],
  exports: [PteroService],
})
export class PteroModule {}
