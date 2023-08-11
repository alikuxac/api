import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import bcrypt from 'bcryptjs';

import { UserSex } from 'src/modules/api/users/constants/user.constant';
import { RoleEntity } from 'src/common/roles/entities/roles.entity';
import { DatabaseEntity } from '@root/common/database/decorators/database.decorator';
import { DatabaseMongoObjectIdEntityAbstract } from '@root/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';

@DatabaseEntity({ collection: 'users', toJSON: { virtuals: true } })
export class UserEntity extends DatabaseMongoObjectIdEntityAbstract {
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

  @Prop({ name: 'password', required: true, type: String })
  password: string;

  @Prop({
    name: 'first_name',
    maxlength: 50,
    lowercase: true,
    trim: true,
    default: '',
  })
  firstName: string;

  @Prop({
    name: 'last_name',
    maxlength: 50,
    lowercase: true,
    trim: true,
    default: '',
  })
  lastName: string;

  @Prop({ name: 'display_name', maxlength: 50, trim: true, default: '' })
  displayName: string;

  @Prop({
    name: 'sex',
    type: String,
    enum: UserSex,
    default: UserSex.UNKNOWN,
  })
  sex: UserSex;

  @Prop({ name: 'avatar', type: String, trim: true, default: '' })
  avatar: string;

  @Prop({ name: 'is_active', type: Boolean, default: true })
  isActive: boolean;

  @Prop({ name: 'last_active', type: Date, default: new Date() })
  lastActive: Date;

  @Prop({ name: 'isBanned', type: Boolean, default: false, index: true })
  isBanned: boolean;

  @Prop({ name: 'banned_at', type: Date, default: null })
  bannedAt: Date;

  @Prop({ name: 'isVerified', type: Boolean, default: false, index: true })
  isVerified: boolean;

  @Prop({ name: 'verified_at', type: Date, default: null })
  verifiedAt: Date;

  @Prop({ name: 'isDisabled', type: Boolean, default: false, index: true })
  isDisabled: boolean;

  @Prop({ name: 'disabled_at', type: Date, default: null })
  disabledAt: Date;

  @Prop({ name: 'isOwner', type: Boolean, default: false })
  isOwner: boolean;

  @Prop({ name: 'signUpDate', type: Date, default: new Date() })
  signUpDate: Date;

  @Prop({
    name: 'role',
    type: MongooseSchema.Types.ObjectId,
    ref: RoleEntity.name,
    index: true,
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDoc = UserEntity & Document;

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
