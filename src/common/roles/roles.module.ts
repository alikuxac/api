import { Module, Global } from '@nestjs/common';

import { RolesService } from './service/roles.service';

import { RoleRepositoryModule } from './repositories/role.repository.module';

@Global()
@Module({
  imports: [RoleRepositoryModule],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
