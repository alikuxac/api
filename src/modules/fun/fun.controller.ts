import { Controller, Get, Param } from '@nestjs/common';
import { FunService } from './fun.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('fun')
@ApiTags('fun')
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
