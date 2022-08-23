import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

import { UserSex } from '@users/enum/sex.enum';
import { UserProvider } from '@users/interfaces/providers.interface';

import { UserRole } from '@users/entities';

@Schema({ collection: 'users', timestamps: true, versionKey: false, _id: true })
export class User {
  @Prop({
    name: 'username',
    type: String,
    maxlength: 255,
    index: true,
    unique: true,
  })
  username: string;

  @Prop({
    name: 'email',
    type: String,
    maxlength: 255,
    index: true,
    unique: true,
  })
  email: string;

  @Prop({ name: 'password', maxlength: 255 })
  password: string;

  @Prop({ name: 'first_name', maxlength: 50, default: '' })
  firstName: string;

  @Prop({ name: 'last_name', maxlength: 50, default: '' })
  lastName: string;

  @Prop({ name: 'display_name', maxlength: 50, default: '' })
  displayName: string;

  @Prop({
    name: 'sex',
    enum: UserSex,
    default: UserSex.UNKNOWN,
  })
  sex: UserSex;

  @Prop({ name: 'is_active', type: Boolean, default: true })
  isActive: boolean;

  @Prop({ name: 'last_active', type: Date, default: new Date() })
  lastActive: Date;

  @Prop({ name: 'banned', type: Boolean, default: false })
  banned: boolean;

  @Prop({ name: 'isVerified', type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ name: 'isDisabled', type: Boolean, default: false })
  isDisabled: boolean;

  @Prop({
    name: 'role',
    type: mongoose.Schema.Types.ObjectId,
    ref: UserRole.name,
  })
  role: UserRole;

  @Prop({ name: 'providers', type: Array<UserProvider>, default: [] })
  providers: UserProvider[] = [];

  @Prop({
    name: 'apikeys',
    type: Array<ApiKey>,
    default: [],
  })
  apikeys: ApiKey[] = [];

  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('email')) return next();
  this.email = this.email.toLowerCase();
  next();
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('username')) return next();
  this.username = this.username.toLowerCase();
  next();
});
