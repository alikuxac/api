import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { UserAfk } from 'src/modules/bot/discord/interfaces';

@Schema({
  collection: 'discord_users',
  versionKey: false,
  timestamps: true,
  _id: true,
})
export class DiscordUser {
  @Prop({
    name: 'userId',
    type: String,
    length: 30,
    required: true,
    unique: true,
    index: true,
  })
  userId: string;

  @Prop({ name: 'afk', type: Object, default: { status: false, reason: '' } })
  afk: UserAfk;

  @Prop({ name: 'lang', type: String, default: 'en' })
  lang: string;
}

export const DiscordUserSchema = SchemaFactory.createForClass(DiscordUser);

export type DiscordUserDoc = DiscordUser & Document;
