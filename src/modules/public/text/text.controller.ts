import { Controller, Get, Param } from '@nestjs/common';
import { TextService } from './text.service';

@Controller('text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Get('morse')
  morse(@Param('text') text: string) {
    return this.textService.morse(text);
  }

  @Get('reverse')
  reverse(@Param('text') text: string) {
    return this.textService.reverse(text);
  }

  @Get('ascii')
  ascii(@Param('text') text: string) {
    return this.textService.ascii(text);
  }

  @Get('base64')
  base64(
    @Param('text') text: string,
    @Param('action') action: 'encode' | 'decode',
  ) {
    return this.textService.base64(text, action);
  }
}
