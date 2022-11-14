import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'discord_users',
  versionKey: false,
  timestamps: true,
  _id: true,
})
export class DiscordUser extends Document {
  @Prop({
    name: 'userId',
    type: String,
    length: 30,
    required: true,
    unique: true,
    index: true,
  })
  userId: string;

  @Prop({ name: 'username', type: String, length: 30 })
  username: string;

  @Prop({ name: 'discriminator', type: String, length: 30 })
  discriminator: string;

  @Prop({ name: 'avatar', type: String, default: '' })
  avatar: string;

  @Prop({ name: 'flags', type: Number })
  flags: number;

  @Prop({ name: 'mfa_enabled', type: Boolean, default: false })
  mfa_enabled: boolean;

  @Prop({ name: 'verified', type: Boolean, default: false })
  verified: boolean;

  @Prop({ name: 'email', type: String, default: '' })
  email: string;
}

export const DiscordUserSchema = SchemaFactory.createForClass(DiscordUser);
