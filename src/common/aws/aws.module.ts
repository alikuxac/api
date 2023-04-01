import { Global, Module } from '@nestjs/common';

import { B2Service } from './services/b2.service';

@Global()
@Module({ providers: [B2Service], exports: [B2Service] })
export class AwsModule {}
