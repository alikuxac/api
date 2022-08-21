import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { customAlphabet } from 'nanoid';

import { UserApiKey } from '@users/entities';

import {
  createUserApiKeyDto,
  updateUserApiKeyDto,
  deleteUserApiKeyDto,
} from '@users/dto';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 20);

@Injectable()
export class UserApiKeyService {
  constructor(
    @InjectModel(UserApiKey.name)
    private readonly userApiKeyModel: Model<UserApiKey>,
  ) {}

  async findAll() {
    return await this.userApiKeyModel.find().exec();
  }

  async findOne(id: string) {
    return await this.userApiKeyModel.findById(id).exec();
  }

  async findByValue(value: string) {
    return await this.userApiKeyModel.findOne({ value }).exec();
  }

  async create(id: string, dto: createUserApiKeyDto) {
    const value = 'ali_' + nanoid();
    const userApiKey = new this.userApiKeyModel({ ...dto, value, owner: id });
    return await userApiKey.save();
  }

  async updateWithUser(id: string, dto: updateUserApiKeyDto) {
    return await this.userApiKeyModel
      .findByIdAndUpdate(
        id,
        { $set: { description: dto.description } },
        { new: true },
      )
      .exec();
  }

  async remove(id: string, dto: deleteUserApiKeyDto) {
    return await this.userApiKeyModel
      .findOneAndDelete({ $and: [{ owner: id }, { name: dto.name }] })
      .exec();
  }

  async removeAll() {
    return await this.userApiKeyModel.deleteMany({}).exec();
  }
}
