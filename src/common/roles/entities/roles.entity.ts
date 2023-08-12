import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { CallbackWithoutResultAndOptionalError, Document } from 'mongoose';
import { DatabaseEntity } from '@root/common/database/decorators/database.decorator';
import { DatabaseMongoObjectIdEntityAbstract } from '@root/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { RolePermissionGroup as PermGroup } from 'src/common/policy/constants/policy.enum.constant';
import { IPolicyRule } from '@root/common/policy/interfaces/policy.interface';

@DatabaseEntity({ collection: 'role', toJSON: { virtuals: true } })
export class RoleEntity extends DatabaseMongoObjectIdEntityAbstract {
  @Prop({
    unique: true,
    index: true,
    required: true,
    maxlength: 30,
    type: String,
    lowercase: true,
  })
  name: string;

  @Prop({
    name: 'description',
    type: String,
    default: '',
    trim: true,
    length: 255,
  })
  description: string;

  @Prop({
    name: 'is_active',
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    name: 'permissions',
    type: [
      {
        action: { type: Array<string>, default: [], required: true },
        subject: { type: String, enum: PermGroup, required: true },
      },
    ],
  })
  permissions: IPolicyRule[];
}

export const RoleSchema = SchemaFactory.createForClass(RoleEntity);

export type RoleDoc = RoleEntity & Document;

RoleSchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
  this.name = this.name.toLowerCase();

  next();
});
