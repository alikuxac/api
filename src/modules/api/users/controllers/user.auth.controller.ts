import {
  Controller,
  Post,
  Req,
  Get,
  Body,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { AuthService } from '@root/common/auth/services/auth.service';
import { UsersService } from 'src/modules/api/users/services/users.service';

import { signInDto, signUpDto } from 'src/modules/api/users/dto/user.auth.dto';
import { ApiTags } from '@nestjs/swagger';

import { SkipAuth } from '@root/common/auth/decorators/auth.skip.decorator';
import { ThrottleredGuard } from '@root/common/request/decorators/request.decorator';
import { AuthJwtAccessProtected } from '@root/common/auth/decorators/auth.jwt.decorator';
import { ResponseCustomHeader } from '@root/common/response/decorators/headers.decorator';
import { Error } from '@root/common/error/decorators/error.decorator';
import { Response } from '@root/common/response/decorators/response.decorator';
import { UserLoginSerialization } from '../serializations/user.login.serialization';

@Controller('auth')
@ApiTags('Auth')
@Error()
@ThrottleredGuard()
@ResponseCustomHeader()
export class UserAuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @SkipAuth()
  @Response('user.login', { serialization: UserLoginSerialization })
  @Post('login')
  async login(@Body() { email, password }: signInDto) {
    const user = await this.usersService.findByUsernameOrEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const validate: boolean = await this.authService.validateUser(
      password,
      user.password,
    );
    if (!validate) {
      throw new UnauthorizedException('Wrong password');
    }

    const userWithRole = await this.usersService.joinWithRole(user);

    const userPayload =
      await this.usersService.payloadSerialization(userWithRole);

    const payload =
      await this.authService.createPayloadAccessToken(userPayload);
    const tokenType: string = await this.authService.getTokenType();
    const expiresIn: number =
      await this.authService.getAccessTokenExpirationTime();

    const payloadAccessToken: Record<string, any> =
      await this.authService.createPayloadAccessToken(payload);
    const payloadRefreshToken: Record<string, any> =
      await this.authService.createPayloadRefreshToken(payload._id, {
        loginDate: payloadAccessToken.loginDate,
      });

    const accessToken: string =
      await this.authService.createAccessToken(payloadAccessToken);

    const refreshToken: string =
      await this.authService.createRefreshToken(payloadRefreshToken);

    return {
      data: { tokenType, expiresIn, accessToken, refreshToken },
    };
  }

  @Get('logout')
  @AuthJwtAccessProtected()
  logout(@Req() req) {
    req.logout();
  }

  @SkipAuth()
  @Response('user.signUp')
  @Post('signup')
  async signup(@Body() dto: signUpDto) {
    const checkUser = await this.usersService.findByEmail(dto.email);
    if (checkUser) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.usersService.create(dto);

    const userWithRole = await this.usersService.joinWithRole(user);

    const userPayload =
      await this.usersService.payloadSerialization(userWithRole);

    const payload =
      await this.authService.createPayloadAccessToken(userPayload);

    const tokenType: string = await this.authService.getTokenType();
    const expiresIn: number =
      await this.authService.getAccessTokenExpirationTime();
    const payloadAccessToken: Record<string, any> =
      await this.authService.createPayloadAccessToken(payload);
    const payloadRefreshToken: Record<string, any> =
      await this.authService.createPayloadRefreshToken(payload.id, {
        loginDate: payloadAccessToken.loginDate,
      });

    const accessToken: string =
      await this.authService.createAccessToken(payloadAccessToken);

    const refreshToken: string =
      await this.authService.createRefreshToken(payloadRefreshToken);

    return {
      data: {
        tokenType,
        expiresIn,
        accessToken,
        refreshToken,
      },
    };
  }
}
