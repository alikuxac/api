import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { RolePermission } from './role.enum';

@Schema({
  collection: 'roles',
  versionKey: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class Role extends Document {
  @Prop({ unique: true, index: true })
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
    type: Array<RolePermission>,
    default: [],
    enum: RolePermission,
  })
  permissions: RolePermission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
