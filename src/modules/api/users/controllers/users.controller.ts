import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseBoolPipe,
  Injectable,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/modules/api/users/services/users.service';
import {
  createUserDto,
  updateUserDto,
  changePasswordDto,
} from 'src/modules/api/users/dto/user.dto';
import { PolicyAbilityProtected } from 'src/common/policy/decorators/policy.decorator';
import {
  RolePermission as PermList,
  RolePermissionGroup as PermGroup,
} from '@root/common/policy/constants/policy.enum.constant';

@Injectable()
@Controller('user')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // User Management
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Create],
  })
  @Post()
  async create(@Body() dto: createUserDto) {
    return await this.usersService.create(dto);
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Read],
  })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('full', ParseBoolPipe) full?: boolean,
  ) {
    return await this.usersService.findOne(id, full);
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Read, PermList.Update],
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: updateUserDto) {
    return await this.usersService.update(id, dto);
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Read, PermList.Delete],
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.removeUser(id);
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Read],
  })
  @Get('username/:username')
  async findByUsername(@Param('username') username: string) {
    return await this.usersService.findByUsername(username);
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Read],
  })
  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return await this.usersService.findByEmail(email);
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Read, PermList.Update],
  })
  @Patch(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() dto: changePasswordDto,
  ) {
    return await this.usersService.changePasswordUser(id, dto.password);
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Read, PermList.Update],
  })
  @Patch(':id/active')
  async active(@Param('id') id: string) {
    return await this.usersService.activeUser(id);
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Read, PermList.Update],
  })
  @Patch(':id/deactive')
  async deactive(@Param('id') id: string) {
    return await this.usersService.deactiveUser(id);
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Read, PermList.Update],
  })
  @Patch(':id/verify')
  async verify(@Param('id') id: string) {
    return await this.usersService.verifyUser(id);
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Read, PermList.Update],
  })
  @Patch(':id/ban')
  async ban(@Param('id') id: string) {
    return await this.usersService.banUser(id);
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Read, PermList.Update],
  })
  @Patch(':id/disable')
  async disable(@Param('id') id: string) {
    return await this.usersService.disableUser(id);
  }

  @PolicyAbilityProtected({
    subject: PermGroup.USER,
    action: [PermList.Read, PermList.Update],
  })
  @Patch(':id/enable')
  async enable(@Param('id') id: string) {
    return await this.usersService.enableUser(id);
  }
}
