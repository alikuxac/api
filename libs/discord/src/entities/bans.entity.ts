import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { BansStatus } from '@discord/interfaces';

@Schema({ collection: 'discord_bans', timestamps: true, versionKey: false })
export class DiscordBan extends Document {
  @Prop({ name: 'userId', unique: true })
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

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const DiscordBanSchema = SchemaFactory.createForClass(DiscordBan);
