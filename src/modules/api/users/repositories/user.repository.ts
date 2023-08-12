import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseModel } from '@root/common/database/decorators/database.decorator';

import { UserDoc, UserEntity } from '../entities/user.entity';
import { RoleEntity } from '@root/common/roles/entities/roles.entity';
import { DatabaseMongoObjectIdRepositoryAbstract } from '@root/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';

@Injectable()
export class UserRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  UserEntity,
  UserDoc
> {
  constructor(
    @DatabaseModel(UserEntity.name)
    private readonly userModel: Model<UserEntity>,
  ) {
    super(userModel, {
      path: 'role',
      localField: 'role',
      foreignField: '_id',
      model: RoleEntity.name,
    });
  }
}
