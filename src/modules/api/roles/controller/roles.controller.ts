import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Req,
  ValidationPipe,
  ForbiddenException,
} from '@nestjs/common';
import { AuthJwtAccessProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
import { RolesService } from '../service/roles.service';
import {
  createRoleDto,
  queryGetAllDto,
  updatePositionDto,
  updateRoleDto,
} from '../dto/roles.dto';
import { RolePermission } from '../constants/role.constant';
import { RoleAbilityFactory } from '../factory/role-ability.factory';
import { Role } from '../entity/roles.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('role')
@ApiTags('Roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly roleAbilityFactory: RoleAbilityFactory,
  ) {}

  @Post()
  async create(@Req() req, @Body() dto: createRoleDto) {
    const ability = await this.roleAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(RolePermission.CreateRole, Role)) {
      throw new ForbiddenException('You do not have permission to create role');
    }
    return await this.rolesService.create(dto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async findAll(@Req() req, @Query() dto: queryGetAllDto) {
    const ability = await this.roleAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(RolePermission.ReadRole, Role)) {
      throw new ForbiddenException(
        'You do not have permission to read role infomation',
      );
    }
    return await this.rolesService.findAll(dto.page);
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    const ability = await this.roleAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(RolePermission.ReadRole, Role)) {
      throw new ForbiddenException(
        'You do not have permission to read role infomation',
      );
    }
    return await this.rolesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: updateRoleDto,
  ) {
    const ability = await this.roleAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(RolePermission.UpdateRole, Role)) {
      throw new ForbiddenException(
        'You do not have permission to update role.',
      );
    }
    return await this.rolesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const ability = await this.roleAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(RolePermission.DeleteRole, Role)) {
      throw new ForbiddenException('You do not have permission to delete.');
    }
    return await this.rolesService.remove(id);
  }

  // @Patch(':id/position')
  // async updatePosition(
  //   @Req() req,
  //   @Param('id') id: string,
  //   @Body() dto: updatePositionDto,
  // ) {
  //   const ability = await this.roleAbilityFactory.createAbilityForUser(
  //     req.user,
  //   );
  //   if (!ability.can(RolePermission.ChangePosition, Role)) {
  //     throw new ForbiddenException(
  //       'You do not have permission to change postion.',
  //     );
  //   }
  //   return await this.rolesService.swapRole(req.user, id, dto.position);
  // }
}
