import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { MinecraftService } from '../service/minecraft.service';
import {
  javaDto,
  parseAddressDto,
  queryDto,
  serverDto,
} from '../dto/minecraft.dto';

import { AuthJwtAccessProtected } from '@root/common/auth/decorators/auth.jwt.decorator';
import { ResponseCustomHeader } from '@root/common/response/decorators/headers.decorator';
import { Error } from '@root/common/error/decorators/error.decorator';

@Controller(['minecraft'])
@ApiTags('Minecraft')
@Error()
@AuthJwtAccessProtected()
@ResponseCustomHeader()
export class MinecraftController {
  constructor(private readonly minecraftService: MinecraftService) {}

  @Get('java')
  @ApiQuery({
    name: 'host',
    required: true,
    description: 'The host to ping',
    type: String,
  })
  @ApiQuery({
    name: 'port',
    required: false,
    description: 'The port to ping',
    type: Number,
  })
  async javaStatus(@Query() query: javaDto) {
    return await this.minecraftService.javaStatus(
      query.host,
      query.port,
      query.legacy,
    );
  }

  @Get('pe')
  @ApiQuery({
    name: 'host',
    required: true,
    description: 'The host to ping',
    type: String,
  })
  @ApiQuery({
    name: 'port',
    required: false,
    description: 'The port to ping',
    type: Number,
  })
  async peStatus(@Query() query: serverDto) {
    return await this.minecraftService.peStatus(query.host, query.port);
  }

  @Get('query')
  @ApiQuery({
    name: 'host',
    required: true,
    description: 'The host to ping',
    type: String,
  })
  @ApiQuery({
    name: 'port',
    required: false,
    description: 'The port to ping',
    type: Number,
  })
  @ApiQuery({
    name: 'full',
    required: false,
    description: 'Whether to return the full response',
    type: Boolean,
  })
  async query(@Query() query: queryDto) {
    return await this.minecraftService.query(
      query.host,
      query.port,
      query.full,
    );
  }

  @Get('address')
  @ApiQuery({
    name: 'address',
    required: true,
    description: 'The address to parse',
    type: String,
  })
  async parseAddress(@Query() query: parseAddressDto) {
    return await this.minecraftService.parseAddress(query.address);
  }
}
