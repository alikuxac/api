import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, default: [] })
  permissions: mongoose.Schema.Types.ObjectId[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
