import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

import { Role, RoleSchema } from './roles.entity';
import { User, UserSchema } from '@users';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }], 'api'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }], 'api'),
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
