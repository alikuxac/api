import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

import { UserSex } from 'src/modules/api/users/constants/user.constant';
import { Role } from 'src/modules/api/roles/entity/roles.entity';

@Schema({ collection: 'users', timestamps: true, versionKey: false, _id: true })
export class User extends Document {
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
    type: String,
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

  @Prop({ name: 'isOwner', type: Boolean, default: false })
  isOwner: boolean;

  @Prop({
    name: 'role',
    type: MongooseSchema.Types.ObjectId,
    ref: Role.name,
  })
  role: Types.ObjectId;
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

UserSchema.pre('save', function (next) {
  if (!this.isModified('username')) return next();
  this.username = this.username.toLowerCase();
  next();
});
