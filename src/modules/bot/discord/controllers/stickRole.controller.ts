import { Controller, Get, Param, Query } from '@nestjs/common';
import { StickRoleService } from 'src/modules/bot/discord/services';
import { getAllStickRoleDto } from 'src/modules/bot/discord/dto/stickRole.dto';
import { ThrottleredGuard } from '@root/common/request/decorators/request.decorator';

@Controller('stickrole')
@ThrottleredGuard()
export class StickRoleController {
  constructor(private readonly stickRoleService: StickRoleService) {}

  @Get()
  async getAll(@Query() dto: getAllStickRoleDto) {
    return await this.stickRoleService.findAll(dto);
  }

  @Get('guild/:id')
  async getRoleInGuild(@Param() id: string) {
    return await this.stickRoleService.getRoleByGuild(id);
  }

  @Get('user/:id')
  async getRoleByUser(@Param() id: string) {
    return await this.stickRoleService.getRoleByUser(id);
  }
}
