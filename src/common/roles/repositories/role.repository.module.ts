import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleEntity, RoleSchema } from '../entities/roles.entity';
import { RoleRepository } from './role.repository';

@Module({
  providers: [RoleRepository],
  exports: [RoleRepository],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: RoleEntity.name,
          schema: RoleSchema,
        },
      ],
      'api',
    ),
  ],
})
export class RoleRepositoryModule {}
