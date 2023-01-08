import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'permissions',
  timestamps: true,
  versionKey: false,
  _id: true,
  toJSON: { virtuals: true },
})
export class Permissions extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const PermissionSchema = SchemaFactory.createForClass(Permissions);
