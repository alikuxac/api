import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'stick_roles',
  versionKey: false,
  timestamps: true,
  _id: true,
})
export class StickRole {
  @Prop({ name: 'guildId', type: String, length: 30, index: true })
  guildId: string;

  @Prop({ name: 'userId', type: String, length: 30, index: true })
  userId: string;

  @Prop({ name: 'roleId', type: String, length: 30, unique: true, index: true })
  roleId: string;

  @Prop({ name: 'color', type: String, lentgh: 10 })
  color: string;
}

export const StickRoleSchema = SchemaFactory.createForClass(StickRole);

export type StickRoleDoc = StickRole & Document;
