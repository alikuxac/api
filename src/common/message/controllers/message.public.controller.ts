import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Error } from '@root/common/error/decorators/error.decorator';

import { MessageService } from 'src/common/message/services/message.service';
import { IResponse } from 'src/common/response/interfaces/response.interface';

@ApiTags('Message')
@Controller('message')
@Error()
export class MessagePublicController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/languages')
  async languages(): Promise<IResponse> {
    const languages: string[] = this.messageService.getAvailableLanguages();

    return {
      data: { languages },
    };
  }
}
