import { Module } from '@nestjs/common';

import { UserCaslModule } from './actions';

@Module({
  imports: [UserCaslModule],
})
export class CaslModule {}
