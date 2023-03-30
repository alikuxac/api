import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DiscordGuild } from 'src/modules/bot/discord/entities/guild.entity';

@Injectable()
export class DiscordService {
  constructor(
    @InjectModel(DiscordGuild.name)
    private readonly discordGuildModel: Model<DiscordGuild>,
  ) {}
}
