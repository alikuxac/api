import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'discord_users_currency',
  versionKey: false,
  timestamps: true,
  _id: true,
})
export class DiscordUserCurrency {
  @Prop({
    name: 'userId',
    type: String,
    length: 30,
    required: true,
    unique: true,
    index: true,
  })
  userId: string;

  @Prop({ name: 'credits', type: Number, default: 0 })
  credits: number;

  @Prop({ name: 'lastDaily', type: Date, default: Date.now() })
  lastDaily: Date;

  @Prop({ name: 'lastWeekly', type: Date, default: Date.now() })
  lastWeekly: Date;

  @Prop({ name: 'lastMonthly', type: Date, default: Date.now() })
  lastMonthly: Date;
}

export const DiscordUserCurrencySchema =
  SchemaFactory.createForClass(DiscordUserCurrency);

export type DiscordUserCurrencyDoc = DiscordUserCurrency & Document;
