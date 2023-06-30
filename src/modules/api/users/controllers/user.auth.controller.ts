/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  Post,
  Req,
  Get,
  Body,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '@root/common/auth/services/auth.service';
import { UsersService } from 'src/modules/api/users/services/users.service';

import { signInDto, signUpDto } from 'src/modules/api/users/dto/user.auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { SkipAuth } from '@root/common/auth/decorators/auth.skip.decorator';

@Injectable()
@Controller('auth')
@ApiTags('Auth')
export class UserAuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @SkipAuth()
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

    const payload = { _id: user._id, username: user.username, role: user.role };
    const tokenType: string = await this.authService.getTokenType();
    const expiresIn: number =
      await this.authService.getAccessTokenExpirationTime();

    const payloadAccessToken: Record<string, any> =
      await this.authService.createPayloadAccessToken(payload);
    const payloadRefreshToken: Record<string, any> =
      await this.authService.createPayloadRefreshToken(payload._id, {
        loginDate: payloadAccessToken.loginDate,
      });

    const accessToken: string = await this.authService.createAccessToken(
      payloadAccessToken,
    );

    const refreshToken: string = await this.authService.createRefreshToken(
      payloadRefreshToken,
    );

    return {
      tokenType,
      expiresIn,
      accessToken,
      refreshToken,
    };
  }

  @Get('logout')
  logout(@Req() req) {
    req.logout();
  }

  @SkipAuth()
  @Post('signup')
  async signup(@Body() dto: signUpDto) {
    const checkUser = await this.usersService.findByEmail(dto.email);
    if (checkUser) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.usersService.create(dto);
    const payload = { id: user._id, username: user.username, role: user.role };
    const tokenType: string = await this.authService.getTokenType();
    const expiresIn: number =
      await this.authService.getAccessTokenExpirationTime();
    const payloadAccessToken: Record<string, any> =
      await this.authService.createPayloadAccessToken(payload);
    const payloadRefreshToken: Record<string, any> =
      await this.authService.createPayloadRefreshToken(payload.id, {
        loginDate: payloadAccessToken.loginDate,
      });

    const accessToken: string = await this.authService.createAccessToken(
      payloadAccessToken,
    );

    const refreshToken: string = await this.authService.createRefreshToken(
      payloadRefreshToken,
    );

    return {
      tokenType,
      expiresIn,
      accessToken,
      refreshToken,
    };
  }
}
