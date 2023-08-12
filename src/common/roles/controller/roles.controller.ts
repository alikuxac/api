import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Put,
  Delete,
  ConflictException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  PaginationQuery,
  PaginationQueryFilterInBoolean,
} from '@root/common/pagination/decorators/pagination.decorator';
import { PolicyAbilityProtected } from '@root/common/policy/decorators/policy.decorator';

import {
  ROLE_DEFAULT_AVAILABLE_ORDER_BY,
  ROLE_DEFAULT_AVAILABLE_SEARCH,
  ROLE_DEFAULT_IS_ACTIVE,
  ROLE_DEFAULT_ORDER_BY,
  ROLE_DEFAULT_ORDER_DIRECTION,
  ROLE_DEFAULT_PER_PAGE,
} from '../constants/role.list.constant';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '../constants/role.status-code.constant';
import {
  RolePermission as PermList,
  RolePermissionGroup as PermGroup,
} from '@root/common/policy/constants/policy.enum.constant';

import { RoleDoc, RoleEntity } from '../entities/roles.entity';
import { UserDoc } from '@root/modules/api/users/entities/user.entity';

import { RoleUpdateDto } from '../dto/role.update.dto';
import { RoleUpdatePermissionDto } from '../dto/role.update-permission.dto';
import { RoleCreateDto } from '../dto/role.create.dto';
import { PaginationListDto } from '@root/common/pagination/dtos/pagination.list.dto';

import { RolesService } from '../service/roles.service';
import { PaginationService } from '@root/common/pagination/services/pagination.service';
import { UsersService } from '@root/modules/api/users/services/users.service';

import {
  RoleCreateDoc,
  RoleGetDoc,
  RoleListDoc,
  RoleDeleteDoc,
  RoleUpdateDoc,
} from '../docs/role.doc';

import { ThrottleredGuard } from '@root/common/request/decorators/request.decorator';
import { AuthJwtAccessProtected } from '@root/common/auth/decorators/auth.jwt.decorator';
import { ResponseCustomHeader } from '@root/common/response/decorators/headers.decorator';
import { Error } from '@root/common/error/decorators/error.decorator';
import { GetRole } from '../decorators/role.decorator';
import {
  RoleAdminDeleteGuard,
  RoleAdminGetGuard,
  RoleAdminUpdateGuard,
} from '../decorators/role.admin.decorator';
import {
  ResponsePaging,
  Response,
} from '@root/common/response/decorators/response.decorator';

import { RoleListSerialization } from '../serializations/role.list.serialization';
import { RoleGetSerialization } from '../serializations/role.get.serialization';
import { ResponseIdSerialization } from '@root/common/response/serializations/response.id.serialization';

@Controller('role')
@ApiTags('Roles')
@Error()
@ThrottleredGuard()
@AuthJwtAccessProtected()
@ResponseCustomHeader()
export class RolesController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly paginationService: PaginationService,
  ) {}

  @RoleCreateDoc()
  @Response('role.create')
  @PolicyAbilityProtected({
    subject: PermGroup.ROLE,
    action: [PermList.CREATE],
  })
  @Post()
  async create(@Body() dto: RoleCreateDto) {
    const { name } = dto;
    const nameExist = await this.rolesService.findOneByName(name, {
      withDeleted: true,
    });
    if (nameExist) {
      throw new ConflictException();
    }
    const newRole = await this.rolesService.create(dto);

    return { data: { _id: newRole._id } };
  }

  @RoleListDoc()
  @ResponsePaging('role.list', { serialization: RoleListSerialization })
  @PolicyAbilityProtected({
    subject: PermGroup.ROLE,
    action: [PermList.READ],
  })
  @Get()
  async findAll(
    @PaginationQuery(
      ROLE_DEFAULT_PER_PAGE,
      ROLE_DEFAULT_ORDER_BY,
      ROLE_DEFAULT_ORDER_DIRECTION,
      ROLE_DEFAULT_AVAILABLE_SEARCH,
      ROLE_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInBoolean('isActive', ROLE_DEFAULT_IS_ACTIVE)
    isActive: Record<string, any>,
  ) {
    const find = {
      ..._search,
      ...isActive,
    };

    const roles: RoleEntity[] = await this.rolesService.findAll(find, {
      paging: { limit: _limit, offset: _offset },
      order: _order,
    });

    const total: number = roles.length;
    const totalPage: number = await this.paginationService.totalPage(
      total,
      _limit,
    );

    return { _pagination: { total, totalPage }, data: roles };
  }

  @RoleGetDoc()
  @Response('role.get', {
    serialization: RoleGetSerialization,
  })
  @PolicyAbilityProtected({
    subject: PermGroup.ROLE,
    action: [PermList.READ],
  })
  @Get('search')
  async search(@Query('name') name: string) {
    const role = await this.rolesService.findOneByName(name);
    if (!role) {
      throw new ConflictException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_EXIST_ERROR,
        message: 'role.error.exist',
      });
    }
    return { data: role };
  }

  @Response('role.get', {
    serialization: RoleGetSerialization,
  })
  @RoleAdminGetGuard()
  @PolicyAbilityProtected({
    subject: PermGroup.ROLE,
    action: [PermList.READ],
  })
  @Get(':id')
  async findOne(@GetRole() roleDoc: RoleDoc) {
    return { data: roleDoc._id };
  }

  @Response('role.update', {
    serialization: ResponseIdSerialization,
  })
  @RoleAdminUpdateGuard()
  @PolicyAbilityProtected({
    subject: PermGroup.ROLE,
    action: [PermList.READ, PermList.UPDATE],
  })
  @Put(':id')
  async update(@GetRole() roleDoc: RoleDoc, @Body() dto: RoleUpdateDto) {
    await this.rolesService.update(roleDoc, dto);

    return;
  }

  @RoleUpdateDoc()
  @Response('role.updatePermission', {
    serialization: ResponseIdSerialization,
  })
  @RoleAdminUpdateGuard()
  @PolicyAbilityProtected({
    subject: PermGroup.ROLE,
    action: [PermList.READ, PermList.UPDATE],
  })
  @Patch(':id/permission')
  async updatePermission(
    @GetRole() roleDoc: RoleDoc,
    @Body() dto: RoleUpdatePermissionDto,
  ) {
    await this.rolesService.updatePermissions(roleDoc, dto);

    return;
  }

  @RoleDeleteDoc()
  @Response('role.delete')
  @RoleAdminDeleteGuard()
  @PolicyAbilityProtected({
    subject: PermGroup.ROLE,
    action: [PermList.READ, PermList.UPDATE],
  })
  @Delete(':id')
  async remove(@GetRole() roleDoc: RoleDoc) {
    const used: UserDoc = await this.usersService.findOne({
      role: roleDoc._id,
    });
    if (used) {
      throw new ConflictException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_USED_ERROR,
        message: 'role.error.used',
      });
    }
    await this.rolesService.delete(roleDoc);

    return;
  }
}
