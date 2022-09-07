import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MinecraftService } from './minecraft.service';
import { javaDto, parseAddressDto, queryDto, serverDto } from './minecraft.dto';

@Controller(['minecraft', 'mc'])
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class MinecraftController {
  constructor(private readonly minecraftService: MinecraftService) {}

  @Get('java')
  async javaStatus(@Query() query: javaDto) {
    return await this.minecraftService.javaStatus(
      query.host,
      query.port,
      query.legacy,
    );
  }

  @Get('pe')
  async peStatus(@Query() query: serverDto) {
    return await this.minecraftService.peStatus(query.host, query.port);
  }

  @Get('query')
  async query(@Query() query: queryDto) {
    return await this.minecraftService.query(
      query.host,
      query.port,
      query.full,
    );
  }

  @Get('address')
  async parseAddress(@Query() query: parseAddressDto) {
    return await this.minecraftService.parseAddress(query.address);
  }
}
