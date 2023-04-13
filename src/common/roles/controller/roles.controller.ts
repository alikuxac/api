import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Injectable,
} from '@nestjs/common';
import { RolesService } from '../service/roles.service';
import {
  createRoleDto,
  queryGetAllDto,
  updateRoleDto,
  updateRolePermissionDto,
} from '../dto/roles.dto';
import { ApiTags } from '@nestjs/swagger';
import { PolicyAbilityProtected } from '@root/common/policy/decorators/policy.decorator';
import {
  RolePermission as PermList,
  RolePermissionGroup as PermGroup,
} from '@root/common/policy/constants/policy.enum.constant';

@Injectable()
@Controller('role')
@ApiTags('Roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Create],
  })
  @Post()
  async create(@Body() dto: createRoleDto) {
    return await this.rolesService.create(dto);
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Read],
  })
  @Get()
  async findAll(@Query() dto: queryGetAllDto) {
    return await this.rolesService.findAll(dto.page);
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Read],
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findOne(id);
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Read, PermList.Update],
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: updateRoleDto) {
    return await this.rolesService.update(id, dto);
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Read, PermList.Update],
  })
  @Patch(':id/permission')
  async updatePermission(
    @Param('id') id: string,
    @Body() dto: updateRolePermissionDto,
  ) {
    return await this.rolesService.updatePermsission(id, dto);
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Read, PermList.Update],
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.rolesService.remove(id);
  }
}
