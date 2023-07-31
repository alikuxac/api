import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { BansStatus } from 'src/modules/bot/discord/interfaces/bans.interface';

@Schema({
  collection: 'discord_bans',
  timestamps: true,
  versionKey: false,
  _id: true,
})
export class DiscordBan {
  @Prop({ name: 'userId', unique: true, index: true, required: true })
  userId: string;

  @Prop({ name: 'reason', length: 255, nullable: false })
  reason: string;

  @Prop({ name: 'proof', nullable: false })
  proof: string;

  @Prop({
    name: 'status',
    enum: BansStatus,
    default: BansStatus.PENDING,
  })
  status: string;

  @Prop({ name: 'reportedBy', nullable: false })
  reportedBy: string;

  @Prop({ name: 'reportedAt', type: 'date', nullable: false })
  reportedAt: Date;

  @Prop({ name: 'staffId', nullable: true })
  staffId: string;
}

export const DiscordBanSchema = SchemaFactory.createForClass(DiscordBan);

export type DiscordBansDoc = DiscordBan & Document;
