import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/modules/api/users/services/users.service';
import {
  createUserDto,
  // updateUserDto,
  changePasswordDto,
} from 'src/modules/api/users/dto/user.dto';
import { PolicyAbilityProtected } from 'src/common/policy/decorators/policy.decorator';
import {
  RolePermission as PermList,
  RolePermissionGroup as PermGroup,
} from '@root/common/policy/constants/policy.enum.constant';

import { UserDoc } from '../entities/user.entity';
import {
  PaginationQuery,
  PaginationQueryFilterInBoolean,
  PaginationQueryFilterEqualObjectId,
} from '@root/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from '@root/common/pagination/dtos/pagination.list.dto';
import {
  USER_DEFAULT_PER_PAGE,
  USER_DEFAULT_ORDER_BY,
  USER_DEFAULT_ORDER_DIRECTION,
  USER_DEFAULT_AVAILABLE_SEARCH,
  USER_DEFAULT_AVAILABLE_ORDER_BY,
  USER_DEFAULT_IS_ACTIVE,
  USER_DEFAULT_BANNED,
} from '../constants/user.list.constant';
import { IUserEntity } from '../interfaces/user.interface';

import { RolesService } from '@root/common/roles/service/roles.service';
import { PaginationService } from '@root/common/pagination/services/pagination.service';
import { ENUM_USER_STATUS_CODE_ERROR } from '../constants/user.status-code.constant';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '@root/common/roles/constants/role.status-code.constant';

import {
  Response,
  ResponsePaging,
} from '@root/common/response/decorators/response.decorator';
import { ThrottleredGuard } from '@root/common/request/decorators/request.decorator';
import { AuthJwtAccessProtected } from '@root/common/auth/decorators/auth.jwt.decorator';
import { ResponseCustomHeader } from '@root/common/response/decorators/headers.decorator';

import {
  UserAdminGetGuard,
  UserAdminDeleteGuard,
  UserAdminUpdateActiveGuard,
  UserAdminUpdateBlockedGuard,
  UserAdminUpdateInactiveGuard,
} from '../decorators/users.admin.decorator';
import { GetUser } from '../decorators/users.decorator';

import { UserListSerialization } from '../serializations/user.list.serialization';
import { ResponseIdSerialization } from '@root/common/response/serializations/response.id.serialization';
import { UserGetSerialization } from '../serializations/user.get.serialization';
import { Error } from '@root/common/error/decorators/error.decorator';

@Controller('user')
@ApiTags('Users')
@Error()
@AuthJwtAccessProtected()
@ThrottleredGuard()
@ResponseCustomHeader()
export class UsersController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly paginationService: PaginationService,
  ) {}

  @ResponsePaging('user.list', { serialization: UserListSerialization })
  @Get()
  async findAll(
    @PaginationQuery(
      USER_DEFAULT_PER_PAGE,
      USER_DEFAULT_ORDER_BY,
      USER_DEFAULT_ORDER_DIRECTION,
      USER_DEFAULT_AVAILABLE_SEARCH,
      USER_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInBoolean('isActive', USER_DEFAULT_IS_ACTIVE)
    isActive: Record<string, any>,
    @PaginationQueryFilterInBoolean('isBanned', USER_DEFAULT_BANNED)
    isBanned: Record<string, any>,
    @PaginationQueryFilterEqualObjectId('role')
    role: Record<string, any>,
  ) {
    const find = {
      ..._search,
      ...isActive,
      ...isBanned,
      ...role,
    };
    const users: IUserEntity[] = await this.usersService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this.usersService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: users,
    };
  }

  @Response('user.create', { serialization: ResponseIdSerialization })
  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.CREATE],
  })
  @Post()
  async create(@Body() dto: createUserDto) {
    const promises: Promise<any>[] = [
      this.rolesService.findOneById(dto.role),
      this.usersService.existByEmail(dto.email),
    ];

    const [checkRole, emailExist] = await Promise.all(promises);

    if (!checkRole) {
      throw new NotFoundException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR,
        message: 'role.error.notFound',
      });
    } else if (emailExist) {
      throw new ConflictException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
        message: 'user.error.emailExist',
      });
    }

    const newUser = await this.usersService.create({ ...dto });
    return { data: { _id: newUser._id } };
  }

  @Response('user.get', { serialization: UserGetSerialization })
  @UserAdminGetGuard()
  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.READ],
  })
  @Get(':id')
  async findOne(@GetUser() user: UserDoc) {
    console.log('user', user);
    return { data: user.toObject() };
  }

  @Response('user.delete')
  @UserAdminDeleteGuard()
  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.READ, PermList.DELETE],
  })
  @Delete(':id')
  async remove(@GetUser() user: UserDoc) {
    await this.usersService.delete(user);

    return;
  }

  @Response('user.changePassword')
  @UserAdminGetGuard()
  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.READ, PermList.UPDATE],
  })
  @Patch(':id/change-password')
  async changePassword(
    @GetUser() user: UserDoc,
    @Body() dto: changePasswordDto,
  ) {
    await this.usersService.updatePassword(user, dto.password);

    return;
  }

  @Response('user.active')
  @UserAdminUpdateActiveGuard()
  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.READ, PermList.UPDATE],
  })
  @Patch(':id/active')
  async active(@GetUser() user: UserDoc) {
    await this.usersService.active(user);

    return;
  }

  @Response('user.deactive')
  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.READ, PermList.UPDATE],
  })
  @Patch(':id/deactive')
  async deactive(@GetUser() user: UserDoc) {
    await this.usersService.inactive(user);

    return;
  }

  @Response('user.verify')
  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.READ, PermList.UPDATE],
  })
  @Patch(':id/verify')
  async verify(@GetUser() user: UserDoc) {
    await this.usersService.verify(user);

    return;
  }

  @Response('user.ban')
  @UserAdminUpdateBlockedGuard()
  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.READ, PermList.UPDATE],
  })
  @Patch(':id/ban')
  async ban(@GetUser() user: UserDoc) {
    await this.usersService.ban(user);

    return;
  }

  @Response('user.unban')
  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.READ, PermList.UPDATE],
  })
  @Patch(':id/unban')
  async unban(@GetUser() user: UserDoc) {
    await this.usersService.ban(user);

    return;
  }

  @Response('user.disable')
  @UserAdminUpdateInactiveGuard()
  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.READ, PermList.UPDATE],
  })
  @Patch(':id/disable')
  async disable(@GetUser() user: UserDoc) {
    await this.usersService.disable(user);

    return;
  }

  @Response('user.enable')
  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.READ, PermList.UPDATE],
  })
  @Patch(':id/enable')
  async enable(@GetUser() user: UserDoc) {
    await this.usersService.enable(user);

    return;
  }
}
