import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'discord_guild',
  versionKey: false,
  timestamps: true,
  _id: true,
})
export class DiscordGuild {
  @Prop({
    name: 'guildId',
    type: String,
    length: 30,
    required: true,
    unique: true,
    index: true,
  })
  guildId: string;

  @Prop({ name: 'prefix', type: Array, default: [] })
  prefix: string[];

  @Prop({ name: 'isLeft', type: Boolean, default: false })
  isLeft: boolean;

  @Prop({ name: 'leftDate', type: Date, default: null })
  leftDate: Date | null;
}

export const DiscordGuildSchema = SchemaFactory.createForClass(DiscordGuild);

export type DiscordGuildDoc = DiscordGuild & Document;
