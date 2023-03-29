import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StickRoleService } from '@discord/services';
import { getAllStickRoleDto } from '@discord/dto/api';

@Controller('discord/stickrole')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
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
