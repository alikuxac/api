import { Controller, Get, Param } from '@nestjs/common';
import { FunService } from './fun.service';

@Controller('fun')
export class FunController {
  constructor(private readonly funService: FunService) {}

  @Get(['age', 'curent-age'])
  getAge(@Param('date') date: string) {
    return this.funService.getAge(date);
  }

  @Get(['year-process'])
  getYearProcess() {
    return this.funService.yearProcess();
  }
}
