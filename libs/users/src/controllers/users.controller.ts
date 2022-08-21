import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtOrApiKeyGuard } from '@auth/guards';
import {
  UsersService,
  UserRoleService,
  UserApiKeyService,
} from '@users/services';
import {
  createUserDto,
  updateUserDto,
  changePasswordDto,
  providerDto,
  setRoleDto,
  createUserRoleDto,
  updateUserRolePermissionDto,
  removeRolePermissionDto,
  createUserApiKeyDto,
  updateUserApiKeyDto,
  deleteUserApiKeyDto,
} from '@users/dto';

@Controller('user')
@UseGuards(JwtOrApiKeyGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userRoleService: UserRoleService,
    private readonly userApiKeyService: UserApiKeyService,
  ) {}

  // User Management
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() dto: createUserDto) {
    return await this.usersService.create(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: updateUserDto) {
    return await this.usersService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.removeUser(id);
  }

  @Get('username/:username')
  async findByUsername(@Param('username') username: string) {
    return await this.usersService.findByUsername(username);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return await this.usersService.findByEmail(email);
  }

  @Patch(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() dto: changePasswordDto,
  ) {
    return await this.usersService.changePasswordUser(id, dto.password);
  }

  @Patch(':id/active')
  async active(@Param('id') id: string) {
    return await this.usersService.activeUser(id);
  }

  @Patch(':id/deactive')
  async deactive(@Param('id') id: string) {
    return await this.usersService.deactiveUser(id);
  }

  @Patch(':id/verify')
  async verify(@Param('id') id: string) {
    return await this.usersService.verifyUser(id);
  }

  @Patch(':id/ban')
  async ban(@Param('id') id: string) {
    return await this.usersService.banUser(id);
  }

  @Patch([':id/link', ':id/link-provider'])
  async link(@Param('id') id: string, @Body() dto: providerDto) {
    return await this.usersService.linkUser(id, dto);
  }

  @Patch(':id/unlink/:provider')
  async unlink(@Param('id') id: string, @Param('provider') provider: string) {
    return await this.usersService.unlinkUser(id, provider);
  }

  @Patch([':id/set-role', ':id/setrole'])
  async setRole(@Param('id') id: string, @Body() dto: setRoleDto) {
    return await this.usersService.setRole(id, dto.roleName);
  }

  @Patch(':id/disable')
  async disable(@Param('id') id: string) {
    return await this.usersService.disableUser(id);
  }

  @Patch(':id/enable')
  async enable(@Param('id') id: string) {
    return await this.usersService.enableUser(id);
  }

  @Get(':id/api-key')
  async findApiKey(@Param('id') id: string) {
    return await this.userApiKeyService.findOne(id);
  }

  @Post(':id/api-key')
  async createUserApiKey(
    @Param('id') id: string,
    @Body() dto: createUserApiKeyDto,
  ) {
    return await this.userApiKeyService.create(id, dto);
  }

  @Patch(':id/api-key')
  async updateApiKey(
    @Param('id') id: string,
    @Body() dto: updateUserApiKeyDto,
  ) {
    return await this.userApiKeyService.updateWithUser(id, dto);
  }

  @Delete(':id/api-key')
  async removeApiKey(
    @Param('id') id: string,
    @Body() dto: deleteUserApiKeyDto,
  ) {
    return await this.userApiKeyService.remove(id, dto);
  }

  // Role Manager
  @Get('role')
  async findAllRoles() {
    return await this.usersService.findAll();
  }

  @Post('role')
  async createRole(@Body() dto: createUserRoleDto) {
    return await this.userRoleService.create(dto);
  }

  @Get('role/:id')
  async findOneRole(@Param('id') id: string) {
    return await this.userRoleService.findOne(id);
  }

  @Patch('role/:id')
  async updateRole(@Param('id') id: string, @Body() dto: createUserRoleDto) {
    return await this.userRoleService.update(id, dto);
  }

  @Delete('role/:id')
  async removeRole(@Param('id') id: string) {
    return await this.userRoleService.delete(id);
  }

  @Post('role/:id/add-permission')
  async addPermission(
    @Param('id') id: string,
    @Body() dto: updateUserRolePermissionDto,
  ) {
    return await this.userRoleService.addPermission(id, dto);
  }

  @Post('role/:id/remove-permission')
  async removePermission(
    @Param('id') id: string,
    @Body() dto: removeRolePermissionDto,
  ) {
    return await this.userRoleService.removePermission(id, dto);
  }

  // ApiKey Management
  @Get('apikey')
  async findAllApiKeys() {
    return await this.userApiKeyService.findAll();
  }
}
