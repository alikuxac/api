import { Controller, Get, Param } from '@nestjs/common';
import { FunService } from '../services/fun.service';
import { ApiTags } from '@nestjs/swagger';

import { Error } from '@root/common/error/decorators/error.decorator';

@Controller('fun')
@ApiTags('Fun')
@Error()
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
