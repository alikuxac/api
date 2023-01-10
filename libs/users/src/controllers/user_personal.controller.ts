import {
  Inject,
  forwardRef,
  Controller,
  Req,
  Get,
  Body,
  Patch,
  UseGuards,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtOrApiKeyGuard } from '@auth/guards';
import { RolePermission as userPerms, RolesService } from '@systems';
import { UserAbilityFactory } from '@users/factory';
import { updateUserDto, updatePasswordDto } from '@users/dto';
import { User } from '@users/entities';
import { UsersService } from '@users/services';

@Injectable()
@Controller('user/me')
@UseGuards(JwtOrApiKeyGuard)
export class UserPersonalController {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService,
    @Inject(forwardRef(() => UserAbilityFactory))
    private readonly userAbilityFactory: UserAbilityFactory,
  ) {}

  // User
  @Get()
  async me(@Req() req) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    if (!ability.can(userPerms.ReadUser, User)) {
      throw new ForbiddenException('You do not have permission to read user');
    }
    return await this.usersService.findOne(req.user.id);
  }

  @Get('ability')
  async meAbility(@Req() req) {
    const ability = await this.userAbilityFactory.createAbilityForUser(
      req.user,
    );
    return ability;
  }

  @Get('role')
  async myRole(@Req() req) {
    const user = await this.usersService.findOne(req.user.id, true);
    const userRole = await this.rolesService.findOne(user.role.toString());
    return userRole;
  }

  @Patch('me')
  async updateMe(@Req() req, @Body() dto: updateUserDto) {
    return await this.usersService.update(req.user.id, dto);
  }

  @Patch('password')
  async updatePassword(@Req() req, @Body() dto: updatePasswordDto) {
    return await this.usersService.changePasswordUser(
      req.user.id,
      dto.password,
    );
  }
}
