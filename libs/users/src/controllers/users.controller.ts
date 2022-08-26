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
} from '@nestjs/common';
import { JwtOrApiKeyGuard } from '@auth/guards';
import { UsersService, UserRoleService } from '@users/services';
import {
  createUserDto,
  updateUserDto,
  changePasswordDto,
  providerDto,
  setRoleDto,
  createUserRoleDto,
  UserRolePermissionDto,
  removeRolePermissionDto,
  createUserApiKeyDto,
  deleteUserApiKeyDto,
  updatePasswordDto,
} from '@users/dto';
import { UserRolePermission as userPerms } from '@users/enum';
import { User, UserRole } from '@users/entities';

import { UserAbilityFactory, UserRoleAbilityFactory } from '@casl/actions/user';

@Controller('user')
@UseGuards(JwtOrApiKeyGuard)
export class UsersController {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => UserRoleService))
    private readonly userRoleService: UserRoleService,
    @Inject(forwardRef(() => UserAbilityFactory))
    private readonly userAbilityFactory: UserAbilityFactory,
    @Inject(forwardRef(() => UserRoleAbilityFactory))
    private readonly userRoleAbilityFactory: UserRoleAbilityFactory,
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

  // User
  @Get('me')
  async me(@Req() req) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.ReadUser, User)) {
      throw new ForbiddenException('You do not have permission to read user');
    }
    return await this.usersService.findOne(req.user.id);
  }

  @Get('me/ability')
  async meAbility(@Req() req) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    return ability;
  }

  @Get('me/role')
  async meRole(@Req() req) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.ReadUser, User)) {
      throw new ForbiddenException('You do not have permission to read user');
    }
    const user = await this.usersService.findOne(req.user.id, true);
    const userRole = await this.userRoleService.findOne(user.role.toString());
    return userRole;
  }

  @Patch('me')
  async updateMe(@Req() req, @Body() dto: updateUserDto) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.UpdateUser, User)) {
      throw new ForbiddenException('You do not have permission to update user');
    }
    return await this.usersService.update(req.user.id, dto);
  }

  @Patch('me/password')
  async updatePassword(@Req() req, @Body() dto: updatePasswordDto) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.ChangePassword, User)) {
      throw new ForbiddenException(
        'You do not have permission to update user password',
      );
    }
    return await this.usersService.changePasswordUser(
      req.user.id,
      dto.password,
    );
  }

  // Role Manager
  @Get('role')
  async findAllRoles(@Req() req) {
    const ability = await this.userRoleAbilityFactory.createAbilityForUserRole(
      req.user,
    );
    if (!ability.can(userPerms.ReadRole, UserRole)) {
      throw new ForbiddenException('You do not have permission to read roles');
    }
    return await this.usersService.findAll();
  }

  @Post('role')
  async createRole(@Req() req, @Body() dto: createUserRoleDto) {
    const ability = await this.userRoleAbilityFactory.createAbilityForUserRole(
      req.user,
    );
    if (!ability.can(userPerms.CreateRole, UserRole)) {
      throw new ForbiddenException('You do not have permission to create role');
    }
    return await this.userRoleService.create(dto);
  }

  @Get('role/:id')
  async findOneRole(@Req() req, @Param('id') id: string) {
    const ability = await this.userRoleAbilityFactory.createAbilityForUserRole(
      req.user,
    );
    if (!ability.can(userPerms.ReadRole, UserRole)) {
      throw new ForbiddenException('You do not have permission to read roles');
    }
    return await this.userRoleService.findOne(id);
  }

  @Patch('role/:id')
  async updateRole(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: createUserRoleDto,
  ) {
    const ability = await this.userRoleAbilityFactory.createAbilityForUserRole(
      req.user,
    );
    if (!ability.can(userPerms.UpdateRole, UserRole)) {
      throw new ForbiddenException('You do not have permission to update role');
    }
    return await this.userRoleService.update(id, dto);
  }

  @Delete('role/:id')
  async removeRole(@Req() req, @Param('id') id: string) {
    const ability = await this.userRoleAbilityFactory.createAbilityForUserRole(
      req.user,
    );
    if (!ability.can(userPerms.DeleteRole, UserRole)) {
      throw new ForbiddenException('You do not have permission to delete role');
    }
    return await this.userRoleService.delete(id);
  }

  @Post([
    'role/:id/add-permission',
    'role/:id/addpermission',
    'role/:id/addperm',
  ])
  async addPermission(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UserRolePermissionDto,
  ) {
    const ability = await this.userRoleAbilityFactory.createAbilityForUserRole(
      req.user,
    );
    if (!ability.can(userPerms.EditRolePermissions, UserRole)) {
      throw new ForbiddenException(
        'You do not have permission to add permission to role',
      );
    }
    return await this.userRoleService.addPermission(id, dto, req.user);
  }

  @Post([
    'role/:id/remove-permission',
    'role/:id/removepermission',
    'role/:id/removeperm',
    'role/:id/rmperm',
    'role/:id/rmpermission',
  ])
  async removePermission(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: removeRolePermissionDto,
  ) {
    const ability = await this.userRoleAbilityFactory.createAbilityForUserRole(
      req.user,
    );
    if (!ability.can(userPerms.EditRolePermissions, UserRole)) {
      throw new ForbiddenException(
        'You do not have permission to remove permission from role',
      );
    }
    return await this.userRoleService.removePermission(id, dto, req.user);
  }
}
