import {
  Inject,
  forwardRef,
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseBoolPipe,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtOrApiKeyGuard } from '@auth/guards';
import { UsersService } from '@users/services';
import {
  createUserDto,
  updateUserDto,
  changePasswordDto,
  providerDto,
  setRoleDto,
  createUserApiKeyDto,
  deleteUserApiKeyDto,
} from '@users/dto';
import { User } from '@users/entities';

import { UserAbilityFactory } from '@users/factory';
import { RolePermission as userPerms } from '@systems';
import { ApiTags } from '@nestjs/swagger';

@Injectable()
@Controller('user')
@ApiTags('Users')
@UseGuards(JwtOrApiKeyGuard)
export class UsersController {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => UserAbilityFactory))
    private readonly userAbilityFactory: UserAbilityFactory,
  ) {}

  // User Management
  @Get()
  async findAll(@Req() req) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.ReadUser, User)) {
      throw new ForbiddenException('You do not have permission to read users');
    }
    return await this.usersService.findAll();
  }

  @Post()
  async create(@Req() req, @Body() dto: createUserDto) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.CreateUser, User)) {
      throw new ForbiddenException(
        'You do not have permission to create users',
      );
    }
    return await this.usersService.create(dto);
  }

  @Get(':id')
  async findOne(
    @Req() req,
    @Param('id') id: string,
    @Query('full', ParseBoolPipe) full: boolean,
  ) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.ReadUser, User)) {
      throw new ForbiddenException('You do not have permission to read users');
    }
    return await this.usersService.findOne(id, full);
  }

  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: updateUserDto,
  ) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.UpdateUser, User)) {
      throw new ForbiddenException(
        'You do not have permission to update users',
      );
    }
    return await this.usersService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.DeleteUser, User)) {
      throw new ForbiddenException(
        'You do not have permission to delete users',
      );
    }
    return await this.usersService.removeUser(id);
  }

  @Get('username/:username')
  async findByUsername(@Req() req, @Param('username') username: string) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.ReadUser, User)) {
      throw new ForbiddenException('You do not have permission to read users');
    }
    return await this.usersService.findByUsername(username);
  }

  @Get('email/:email')
  async findByEmail(@Req() req, @Param('email') email: string) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.ReadUser, User)) {
      throw new ForbiddenException('You do not have permission to read users');
    }
    return await this.usersService.findByEmail(email);
  }

  @Patch(':id/change-password')
  async changePassword(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: changePasswordDto,
  ) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.ChangePassword, User)) {
      throw new ForbiddenException(
        'You do not have permission to change password',
      );
    }
    return await this.usersService.changePasswordUser(id, dto.password);
  }

  @Patch(':id/active')
  async active(@Req() req, @Param('id') id: string) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.UpdateUser, User)) {
      throw new ForbiddenException(
        'You do not have permission to active users',
      );
    }
    return await this.usersService.activeUser(id);
  }

  @Patch(':id/deactive')
  async deactive(@Req() req, @Param('id') id: string) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.UpdateUser, User)) {
      throw new ForbiddenException(
        'You do not have permission to deactive users',
      );
    }
    return await this.usersService.deactiveUser(id);
  }

  @Patch(':id/verify')
  async verify(@Req() req, @Param('id') id: string) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.UpdateUser, User)) {
      throw new ForbiddenException(
        'You do not have permission to verify users',
      );
    }
    return await this.usersService.verifyUser(id);
  }

  @Patch(':id/ban')
  async ban(@Req() req, @Param('id') id: string) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.BanUser, User)) {
      throw new ForbiddenException('You do not have permission to ban users');
    }
    return await this.usersService.banUser(id);
  }

  @Patch([':id/link', ':id/link-provider'])
  async link(@Req() req, @Param('id') id: string, @Body() dto: providerDto) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.UpdateUser, User)) {
      throw new ForbiddenException(
        'You do not have permission to link user provider',
      );
    }
    return await this.usersService.linkUser(id, dto);
  }

  @Patch(':id/unlink/:provider')
  async unlink(
    @Req() req,
    @Param('id') id: string,
    @Param('provider') provider: string,
  ) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.UpdateUser, User)) {
      throw new ForbiddenException(
        'You do not have permission to unlink user provider',
      );
    }
    return await this.usersService.unlinkUser(id, provider);
  }

  @Patch([':id/set-role', ':id/setrole'])
  async setRole(@Req() req, @Param('id') id: string, @Body() dto: setRoleDto) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.SetUserRole, User)) {
      throw new ForbiddenException(
        'You do not have permission to set user role',
      );
    }
    return await this.usersService.setRole(id, dto.roleName, req.user);
  }

  @Patch(':id/disable')
  async disable(@Req() req, @Param('id') id: string) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.UpdateUser, User)) {
      throw new ForbiddenException(
        'You do not have permission to disable users',
      );
    }
    return await this.usersService.disableUser(id);
  }

  @Patch(':id/enable')
  async enable(@Req() req, @Param('id') id: string) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.UpdateUser, User)) {
      throw new ForbiddenException(
        'You do not have permission to enable users',
      );
    }
    return await this.usersService.enableUser(id);
  }

  @Post([':id/api-key', ':id/apikey'])
  async createUserApiKey(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: createUserApiKeyDto,
  ) {
    return await this.usersService.createApiKey(id, dto);
  }

  @Delete([':id/api-key', ':id/apikey'])
  async removeApiKey(
    @Param('id') id: string,
    @Body() dto: deleteUserApiKeyDto,
  ) {
    return await this.usersService.deleteApiKey(id, dto.name);
  }
}
