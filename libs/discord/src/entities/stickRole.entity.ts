import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'stick_roles',
  versionKey: false,
  timestamps: true,
  _id: true,
})
export class StickRole extends Document {
  @Prop({ name: 'guildId', type: String, length: 30 })
  guildId: string;

  @Prop({ name: 'userId', type: String, length: 30 })
  userId: string;

  @Prop({ name: 'roleId', type: String, length: 30 })
  roleId: string;
}

export const StickRoleSchema = SchemaFactory.createForClass(StickRole);