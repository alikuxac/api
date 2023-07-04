import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessageService } from 'src/common/message/services/message.service';
import { IResponse } from 'src/common/response/interfaces/response.interface';

@ApiTags('common.public.message')
@Controller({
  version: VERSION_NEUTRAL,
  path: '/message',
})
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
