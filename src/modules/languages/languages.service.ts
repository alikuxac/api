import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Language } from './entities/language.entity';

import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectModel(Language.name, 'api')
    private readonly langModel: Model<Language>,
  ) {}

  async create(dto: CreateLanguageDto) {
    const createdLang = new this.langModel(dto);
    return await createdLang.save();
  }

  async findAll() {
    return await this.langModel.find().exec();
  }

  async findOne(id: string) {
    return await this.langModel.findById(id).exec();
  }

  async update(id: string, dto: UpdateLanguageDto) {
    return await this.langModel.findByIdAndUpdate(id, dto);
  }

  async remove(id: string) {
    return await this.langModel.findByIdAndDelete(id);
  }
}
