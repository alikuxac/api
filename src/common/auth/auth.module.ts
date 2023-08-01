import { Module, Global } from '@nestjs/common';

import { AuthService } from './services/auth.service';

// Strategy
import { AuthJwtAccessStrategy } from './guards/jwt-access/jwt-access.strategy';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [AuthService, AuthJwtAccessStrategy],
  exports: [AuthService],
})
export class AuthModule {}
