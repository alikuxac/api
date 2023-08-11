import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { RoleDoc, RoleEntity } from '../entities/roles.entity';
import { DatabaseMongoObjectIdRepositoryAbstract } from '@root/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
@Injectable()
export class RoleRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  RoleEntity,
  RoleDoc
> {
  protected defaultRole = 'everyone';

  constructor(
    @DatabaseModel(RoleEntity.name)
    private readonly roleModel: Model<RoleEntity>,
  ) {
    super(roleModel);
  }

  async init() {
    const roleFound = await this.roleModel.countDocuments().exec();
    if (roleFound === 0) {
      const newRole = await this.roleModel.create({
        name: this.defaultRole,
        description: this.defaultRole,
        isActive: true,
        permissions: [],
      });
      await newRole.save();
    }
  }

  async getDefaultRole() {
    const result = await this.roleModel.find({ name: this.defaultRole }).exec();
    return result;
  }

  get getDefaultRoleName() {
    return this.defaultRole;
  }
}
