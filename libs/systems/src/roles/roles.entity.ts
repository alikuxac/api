import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { RolePermission } from './role.enum';

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
    type: Array<RolePermission>,
    default: [],
    enum: RolePermission,
  })
  permissions: RolePermission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
