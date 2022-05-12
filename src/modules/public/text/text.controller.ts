import { Controller, Get, Query } from '@nestjs/common';
import { TextService } from './text.service';

@Controller('text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Get('morse')
  morse(@Query('text') text: string) {
    return this.textService.morse(text);
  }

  @Get('reverse')
  reverse(@Query('text') text: string) {
    return this.textService.reverse(text);
  }

  @Get('ascii')
  ascii(@Query('text') text: string) {
    return this.textService.ascii(text);
  }

  @Get('base64')
  base64(
    @Query('text') text: string,
    @Query('action') action: 'encode' | 'decode',
  ) {
    return this.textService.base64(text, action);
  }
}
