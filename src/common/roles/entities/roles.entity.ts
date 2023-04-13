import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { RolePermissionGroup as PermGroup } from 'src/common/policy/constants/policy.enum.constant';
import { IPolicyRule } from '@root/common/policy/interfaces/policy.interface';
@Schema({
  collection: 'role',
  versionKey: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class Role extends Document {
  @Prop({ unique: true, index: true, length: 50, required: true })
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
    name: 'position',
    type: Number,
  })
  position: number;

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

export const RoleSchema = SchemaFactory.createForClass(Role);
