import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RolesService } from './service/roles.service';
import { Role, RoleSchema } from './entities/roles.entity';
import { User, UserSchema } from 'src/modules/api/users/entities/user.entity';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Role.name, schema: RoleSchema },
        { name: User.name, schema: UserSchema },
      ],
      'api',
    ),
  ],
  controllers: [],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
