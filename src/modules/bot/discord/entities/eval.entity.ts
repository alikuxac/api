import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'discord_eval',
  timestamps: true,
  versionKey: false,
  _id: true,
})
export class DiscordEval extends Document {
  @Prop({ name: 'botId', required: true, length: 30 })
  botId: string;

  @Prop({ name: 'userId', required: true, length: 30 })
  userId: string;

  @Prop({ name: 'code', required: true, length: 1000 })
  code: string;

  @Prop({ name: 'result', required: true, length: 2000 })
  result: string;

  @Prop({ name: 'attachments', required: false, length: 100 })
  attachmentsUrl: string;
}

export const DiscordEvalSchema = SchemaFactory.createForClass(DiscordEval);
