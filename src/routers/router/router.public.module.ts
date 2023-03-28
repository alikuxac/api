import { Module } from '@nestjs/common';

import { FunModule } from 'src/modules/public/fun/fun.module';
import { FunController } from '@root/modules/public/fun/controller/fun.controller';

@Module({ imports: [FunModule], controllers: [FunController] })
export class RouterPublicModule {}
