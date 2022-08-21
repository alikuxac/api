import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { User } from '@users/entities';

@Schema({
  collection: 'users_apikey',
  timestamps: true,
  versionKey: false,
  _id: true,
})
export class UserApiKey {
  @Prop({ name: 'key_name', required: true })
  name: string;

  @Prop({ name: 'key_value', required: true })
  value: string;

  @Prop({ name: 'key_description', default: '', maxlength: 255 })
  description: string;

  @Prop({ name: 'ip_whitelist', type: Array<string>, default: [] })
  ipWhitelist: string[];

  @Prop({ name: 'owner', type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId | string;
}

export const UserApiKeySchema = SchemaFactory.createForClass(UserApiKey);
export type UserApiKeyDocument = UserApiKey & Document;
