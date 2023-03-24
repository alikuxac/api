import {
  Controller,
  Get,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { HypixelService } from '../services/hypixel.service';
import { uuidDto, guildDto } from '../dto/hypixel.dto';
import { HypixelGuard } from '@hypixel/hypixel.guard';

@Controller('hypixel')
@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
)
@UseGuards(HypixelGuard)
@ApiTags('Hypixel')
export class HypixelController {
  constructor(private readonly hypixelService: HypixelService) {}

  @Get('apikey')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get api key information',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'Rate limit',
  })
  async apikey() {
    return await this.hypixelService.getApiKeyInfomation();
  }

  @Get('player')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get player information',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'Rate limit',
  })
  async player(@Query() dto: uuidDto) {
    return await this.hypixelService.getSpecificPlayer(dto.uuid);
  }

  @Get('friend')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get player friends',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Invalid api key',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Invalid api key',
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'Rate limit',
  })
  async friend(@Query() dto: uuidDto) {
    return await this.hypixelService.getFriend(dto.uuid);
  }

  @Get('recentgames')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get player information',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Invalid api key',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Invalid api key',
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'Rate limit',
  })
  async recentgames(@Query() dto: uuidDto) {
    return await this.hypixelService.getRecentGames(dto.uuid);
  }

  @Get('online')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get player information',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'Rate limit',
  })
  async online(@Query() dto: uuidDto) {
    return await this.hypixelService.getPlayerOnlineStatus(dto.uuid);
  }

  @Get('guild')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get player information',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Invalid api key',
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'Rate limit',
  })
  async guild(@Query() dto: guildDto) {
    return await this.hypixelService.getGuild(dto.id, dto.player, dto.name);
  }
}
