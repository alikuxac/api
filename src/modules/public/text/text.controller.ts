import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { TextService } from './text.service';
import { TextDto, base64TextDto } from './text.dto';

@Controller(['text', 'txt'])
@ApiTags('text')
@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
)
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Get('morse')
  @ApiOkResponse({ status: 200, description: 'Returns the text in binary' })
  morse(@Query() dto: TextDto) {
    return this.textService.morse(dto.text);
  }

  @Get('reverse')
  @ApiOkResponse({ status: 200, description: 'Returns the text in reverse' })
  reverse(@Query() dto: TextDto) {
    return this.textService.reverse(dto.text);
  }

  @Get('ascii')
  @ApiOkResponse({ status: 200, description: 'Returns the text in ascii' })
  ascii(@Query() dto: TextDto) {
    return this.textService.ascii(dto.text);
  }

  @Get('base64')
  @ApiOkResponse({ status: 200, description: 'Returns the text in base64' })
  base64(@Query() dto: base64TextDto) {
    return this.textService.base64(dto);
  }
}
