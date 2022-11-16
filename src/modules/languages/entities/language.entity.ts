import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'languages',
  timestamps: true,
  versionKey: false,
  _id: false,
})
export class Language extends Document {
  @Prop({ name: 'key', required: true, unique: true })
  key: string;

  @Prop({ name: 'value', required: true })
  value: string;

  @Prop({ name: 'lang', required: true })
  lang: string;

  @Prop({ name: 'type', required: true })
  type: string;
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
