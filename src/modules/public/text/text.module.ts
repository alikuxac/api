import { Module } from '@nestjs/common';

import { TextService } from './services/text.service';

@Module({
  controllers: [],
  providers: [TextService],
})
export class TextModule {}
