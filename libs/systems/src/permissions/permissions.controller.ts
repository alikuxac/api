import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { createPermissionsDto, updatePermissionsDto } from './permissions.dto';

@Controller('systems/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  async create(@Body() dto: createPermissionsDto) {
    return await this.permissionsService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.permissionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.permissionsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: updatePermissionsDto) {
    return await this.permissionsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.permissionsService.delete(id);
  }
}
