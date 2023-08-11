import { Controller, Get, Param } from '@nestjs/common';
import { FunService } from '../services/fun.service';
import { ApiTags } from '@nestjs/swagger';

import { ThrottleredGuard } from '@root/common/request/decorators/request.decorator';
import { ResponseCustomHeader } from '@root/common/response/decorators/headers.decorator';
import { Error } from '@root/common/error/decorators/error.decorator';

@Controller('fun')
@ApiTags('Fun')
@Error()
@ThrottleredGuard()
@ResponseCustomHeader()
export class FunController {
  constructor(private readonly funService: FunService) {}

  @Get('age')
  getAge(@Param('date') date: string) {
    return this.funService.getAge(date);
  }

  @Get('year-process')
  getYearProcess() {
    return this.funService.yearProcess();
  }
}
