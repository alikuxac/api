import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TextService } from './text.service';
import { TextDto, base64TextDto } from './dto/text.dto';

@Controller()
@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
)
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Get('morse')
  morse(@Query() dto: TextDto) {
    return this.textService.morse(dto.text);
  }

  @Get('reverse')
  reverse(@Query() dto: TextDto) {
    return this.textService.reverse(dto.text);
  }

  @Get('ascii')
  ascii(@Query() dto: TextDto) {
    return this.textService.ascii(dto.text);
  }

  @Get('base64')
  base64(@Query() dto: base64TextDto) {
    return this.textService.base64(dto.text, dto.action);
  }
}
