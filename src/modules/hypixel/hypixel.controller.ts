import {
  Controller,
  Get,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HypixelService } from './hypixel.service';
import { uuidDto, guildDto } from './hypixel.dto';
import { HypixelGuard } from '@hypixel/hypixel.guard';

@Controller()
@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
)
@UseGuards(HypixelGuard)
export class HypixelController {
  constructor(private readonly hypixelService: HypixelService) {}

  @Get('apikey')
  async apikey() {
    return await this.hypixelService.getApiKeyInfomation();
  }

  @Get('player')
  async player(@Query() dto: uuidDto) {
    return await this.hypixelService.getSpecificPlayer(dto.uuid);
  }

  @Get('friend')
  async friend(@Query() dto: uuidDto) {
    return await this.hypixelService.getFriend(dto.uuid);
  }

  @Get('recentgames')
  async recentgames(@Query() dto: uuidDto) {
    return await this.hypixelService.getRecentGames(dto.uuid);
  }

  @Get('online')
  async online(@Query() dto: uuidDto) {
    return await this.hypixelService.getPlayerOnlineStatus(dto.uuid);
  }

  @Get('guild')
  async guild(@Query() dto: guildDto) {
    return await this.hypixelService.getGuild(dto.id, dto.player, dto.name);
  }
}
