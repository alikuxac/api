import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { UserRolePermission } from '@users/enum';

@Schema({
  collection: 'users_role',
  versionKey: false,
  timestamps: true,
  _id: true,
})
export class UserRole extends Document {
  @Prop({
    type: String,
    required: true,
    trim: true,
    unique: true,
    uppercase: true,
  })
  name: string;

  @Prop({
    type: String,
    default: '',
    trim: true,
  })
  description: string;

  @Prop({
    name: 'position',
    type: Number,
    default: 0,
  })
  position: number;

  @Prop({
    type: Array<UserRolePermission>,
    default: [],
  })
  permissions: UserRolePermission[];
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
export type UserRoleDocument = UserRole & Document;
