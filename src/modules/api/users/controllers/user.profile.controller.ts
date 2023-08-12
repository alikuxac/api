import { Body, Controller, Get, Patch } from '@nestjs/common';

import { UsersService } from '../services/users.service';
import { UserDoc } from '../entities/user.entity';

import { GetUser, UserProtected } from '../decorators/users.decorator';
import { AuthJwtAccessProtected } from '@root/common/auth/decorators/auth.jwt.decorator';
import { ThrottleredGuard } from '@root/common/request/decorators/request.decorator';
import { ResponseCustomHeader } from '@root/common/response/decorators/headers.decorator';
import { Response } from '@root/common/response/decorators/response.decorator';
import { Error } from '@root/common/error/decorators/error.decorator';

import { IUserDoc } from '../interfaces/user.interface';

import { UserProfileSerialization } from '../serializations/user.profile.serialization';

import { changePasswordDto } from '../dto/user.dto';

@Controller('profile')
@Error()
@AuthJwtAccessProtected()
@ThrottleredGuard()
@ResponseCustomHeader()
export class UserProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Response('user.profile', {
    serialization: UserProfileSerialization,
  })
  @UserProtected()
  @Get()
  async getProfile(@GetUser() user: UserDoc) {
    const userWithRole: IUserDoc = await this.usersService.joinWithRole(user);
    return { data: userWithRole.toObject() };
  }

  @UserProtected()
  @Patch('change-password')
  async updatePassword(
    @GetUser() user: UserDoc,
    @Body() dto: changePasswordDto,
  ) {
    await this.usersService.updatePassword(user, dto.password);

    return;
  }
}
