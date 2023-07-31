import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'discord_users_leveling',
  versionKey: false,
  timestamps: true,
  _id: true,
})
export class DiscordUserLeveling {
  @Prop({
    name: 'userId',
    type: String,
    length: 30,
    required: true,
    unique: true,
    index: true,
  })
  userId: string;

  @Prop({ name: 'xp', type: Number, default: 0 })
  xp: number;

  @Prop({ name: 'level', type: Number, default: 0 })
  level: number;

  @Prop({ name: 'lastActive', type: Date, default: Date.now })
  lastActive: Date;

  @Prop({ name: 'announcements', type: Boolean, default: true })
  announcements: boolean;
}
export const DiscordUserLevelingSchema =
  SchemaFactory.createForClass(DiscordUserLeveling);

export type DiscordUserLevelingDoc = DiscordUserLeveling & Document;
