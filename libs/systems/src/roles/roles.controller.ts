import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { createRoleDto, updatePositionDto, updateRoleDto } from './roles.dto';

@Controller('systems/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() dto: createRoleDto) {
    return await this.rolesService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.rolesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: updateRoleDto) {
    return await this.rolesService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.rolesService.remove(+id);
  }

  @Patch(':id/position')
  async updatePosition(
    @Param('id') id: string,
    @Body() dto: updatePositionDto,
  ) {
    return await this.rolesService.swapRole(id, dto.position);
  }
}
