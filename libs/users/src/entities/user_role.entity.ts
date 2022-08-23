import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { IUserRolePermission } from '@users/interfaces';

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
    type: Array<IUserRolePermission>,
    default: [],
  })
  permissions: IUserRolePermission[];
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
export type UserRoleDocument = UserRole & Document;
