import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LanguagesService } from './languages.service';
import { LanguagesController } from './languages.controller';

import { Language, LanguageSchema } from './entities/language.entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Language.name, schema: LanguageSchema }],
      'api',
    ),
  ],
  controllers: [LanguagesController],
  providers: [LanguagesService],
})
export class LanguagesModule {}
